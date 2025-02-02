import { useEffect } from "react";

export const themeTrImage = "/azusa-dance.webp";
export const bgHzLightImage = "/hz-background-light.webp";
export const bgVerLightImage = "/ver-background-light.webp";
export const bgHzDarkImage = "/hz-background-dark.webp";
export const bgVerDarkImage = "/ver-background-dark.webp";
export const azusaCatImage = "/me-azusa.webp";
export const noticeAzusaCatImage = "/notice-1.webp";

export const LoadRequiredImage = () => {
  useEffect(() => {
    const imagesToPreload = [
      themeTrImage,
      bgHzLightImage,
      bgHzDarkImage,
      azusaCatImage,
    ];

    imagesToPreload.forEach((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    });
  }, []);
};
