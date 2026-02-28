import { canvasToBlob, drawImageToCanvas } from "./converter";

export function removeBackground(
  img: HTMLImageElement,
  targetColor: { r: number; g: number; b: number },
  tolerance: number,
): HTMLCanvasElement {
  const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const tolSq = tolerance * tolerance;
  const { r: tr, g: tg, b: tb } = targetColor;

  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - tr;
    const dg = data[i + 1] - tg;
    const db = data[i + 2] - tb;
    const distSq = dr * dr + dg * dg + db * db;

    if (distSq <= tolSq) {
      // Fully transparent
      data[i + 3] = 0;
    } else if (distSq <= tolSq * 4) {
      // Soft edge — partially transparent
      const ratio = Math.sqrt(distSq) / (tolerance * 2);
      data[i + 3] = Math.round(data[i + 3] * Math.min(1, ratio));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function detectBackgroundColor(img: HTMLImageElement): {
  r: number;
  g: number;
  b: number;
} {
  const canvas = drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;

  // Sample corners (5×5 px area in each corner)
  const sampleSize = 5;
  const corners = [
    ctx.getImageData(0, 0, sampleSize, sampleSize),
    ctx.getImageData(w - sampleSize, 0, sampleSize, sampleSize),
    ctx.getImageData(0, h - sampleSize, sampleSize, sampleSize),
    ctx.getImageData(w - sampleSize, h - sampleSize, sampleSize, sampleSize),
  ];

  let r = 0,
    g = 0,
    b = 0,
    count = 0;
  for (const corner of corners) {
    for (let i = 0; i < corner.data.length; i += 4) {
      r += corner.data[i];
      g += corner.data[i + 1];
      b += corner.data[i + 2];
      count++;
    }
  }

  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  };
}

export async function removeBackgroundAndExport(
  img: HTMLImageElement,
  targetColor: { r: number; g: number; b: number },
  tolerance: number,
): Promise<Blob> {
  const canvas = removeBackground(img, targetColor, tolerance);
  return canvasToBlob(canvas, "image/png", 100);
}
