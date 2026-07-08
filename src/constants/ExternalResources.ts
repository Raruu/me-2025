import { env } from "@/lib/env";

export const BaseExternalResource = env.NEXT_PUBLIC_EXTERNAL_RESOURCE;
export const MyWorksJson = `${BaseExternalResource}/assets/porto.json`;
export const MyCvJson = `${BaseExternalResource}/assets/cv.json`;
