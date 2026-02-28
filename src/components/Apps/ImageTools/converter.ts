import { FORMAT_INFO, ICO_PRESETS, OutputFormat } from "./constants";

export function drawImageToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Conversion failed"))),
      mime,
      quality / 100,
    );
  });
}

export async function encodeIco(
  img: HTMLImageElement,
  sizes: number[],
): Promise<Blob> {
  const images: ArrayBuffer[] = [];

  for (const size of sizes) {
    const canvas = drawImageToCanvas(img, size, size);
    const blob = await canvasToBlob(canvas, "image/png", 100);
    images.push(await blob.arrayBuffer());
  }

  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * images.length;
  let offset = headerSize + dirSize;

  const totalSize =
    offset + images.reduce((sum, buf) => sum + buf.byteLength, 0);
  const result = new ArrayBuffer(totalSize);
  const view = new DataView(result);

  // ICO Header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type: 1 = ICO
  view.setUint16(4, images.length, true); // Number of images

  // Directory entries
  for (let i = 0; i < images.length; i++) {
    const size = sizes[i];
    const imgData = images[i];
    const entryOffset = headerSize + i * dirEntrySize;

    view.setUint8(entryOffset + 0, size >= 256 ? 0 : size); // Width
    view.setUint8(entryOffset + 1, size >= 256 ? 0 : size); // Height
    view.setUint8(entryOffset + 2, 0); // Color palette
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, imgData.byteLength, true); // Image data size
    view.setUint32(entryOffset + 12, offset, true); // Offset to image data

    const dest = new Uint8Array(result, offset, imgData.byteLength);
    dest.set(new Uint8Array(imgData));
    offset += imgData.byteLength;
  }

  return new Blob([result], { type: "image/x-icon" });
}

export async function convertImage(
  img: HTMLImageElement,
  outputFormat: OutputFormat,
  quality: number,
  icoPresetIndex: number,
  customIcoSize: number,
  resizeWidth?: number,
  resizeHeight?: number,
): Promise<Blob> {
  if (outputFormat === "ico") {
    const preset = ICO_PRESETS[icoPresetIndex];
    const sizes = preset.label === "Custom" ? [customIcoSize] : preset.sizes;
    return encodeIco(img, sizes);
  }

  const w = resizeWidth ?? img.naturalWidth;
  const h = resizeHeight ?? img.naturalHeight;
  const canvas = drawImageToCanvas(img, w, h);
  const info = FORMAT_INFO[outputFormat];
  return canvasToBlob(canvas, info.mime, quality);
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileNameWithoutExt(name: string): string {
  const lastDot = name.lastIndexOf(".");
  return lastDot > 0 ? name.substring(0, lastDot) : name;
}
