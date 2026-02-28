import { canvasToBlob } from "./converter";

export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function cropImage(
  img: HTMLImageElement,
  crop: CropRect,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(crop.w);
  canvas.height = Math.round(crop.h);
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    Math.round(crop.x),
    Math.round(crop.y),
    Math.round(crop.w),
    Math.round(crop.h),
    0,
    0,
    Math.round(crop.w),
    Math.round(crop.h),
  );
  return canvas;
}

export async function cropAndExport(
  img: HTMLImageElement,
  crop: CropRect,
): Promise<Blob> {
  const canvas = cropImage(img, crop);
  return canvasToBlob(canvas, "image/png", 100);
}
