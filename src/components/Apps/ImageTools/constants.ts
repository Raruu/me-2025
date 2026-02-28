export type OutputFormat = "png" | "jpeg" | "webp" | "bmp" | "ico";

export type ActiveTool = "convert" | "crop" | "remove-bg";

export interface ToolDef {
  id: ActiveTool;
  label: string;
  icon: string;
}

export const TOOLS: ToolDef[] = [
  { id: "convert", label: "Convert", icon: "mdi:swap-horizontal" },
  { id: "crop", label: "Crop", icon: "mdi:crop" },
  { id: "remove-bg", label: "Remove BG", icon: "mdi:image-remove" },
];

export interface IcoPreset {
  label: string;
  sizes: number[];
}

export interface ResizePreset {
  label: string;
  width: number;
  height: number;
}

export interface AspectRatioPreset {
  label: string;
  w: number;
  h: number;
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "3:2", w: 3, h: 2 },
  { label: "16:9", w: 16, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "3:4", w: 3, h: 4 },
];

export const APP_TITLE = "Image Tools";
export const APP_ICON = "mdi:image-edit";
export const APPID = "image-tools";

export const ICO_PRESETS: IcoPreset[] = [
  { label: "Favicon (16×16)", sizes: [16] },
  { label: "Favicon Multi (16, 32, 48)", sizes: [16, 32, 48] },
  { label: "Windows Icon (256×256)", sizes: [256] },
  { label: "Custom", sizes: [32] },
];

export const RESIZE_PRESETS: ResizePreset[] = [
  { label: "Minecraft Server Icon", width: 64, height: 64 },
  { label: "Discord Emoji", width: 128, height: 128 },
  { label: "Thumbnail (150×150)", width: 150, height: 150 },
  { label: "HD (1280×720)", width: 1280, height: 720 },
  { label: "Full HD (1920×1080)", width: 1920, height: 1080 },
];

export const FORMAT_INFO: Record<
  OutputFormat,
  { label: string; ext: string; mime: string }
> = {
  png: { label: "PNG", ext: ".png", mime: "image/png" },
  jpeg: { label: "JPEG", ext: ".jpg", mime: "image/jpeg" },
  webp: { label: "WebP", ext: ".webp", mime: "image/webp" },
  bmp: { label: "BMP", ext: ".bmp", mime: "image/bmp" },
  ico: { label: "ICO", ext: ".ico", mime: "image/x-icon" },
};

export const QUALITY_FORMATS: OutputFormat[] = ["jpeg", "webp"];
