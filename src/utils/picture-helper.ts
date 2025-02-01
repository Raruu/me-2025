import { useEffect } from "react";

export const themeTrImage = "/azusa-dance.webp";
export const bgLightImage = "/background-light.webp";
export const bgDarkImage = "/background-dark.webp";
export const azusaCatImage = "/me-azusa.webp";
export const notice1Image = "/notice-1.webp";

export const LoadRequiredImage = () => {
  useEffect(() => {
    const imagesToPreload = [
      themeTrImage,
      bgLightImage,
      bgDarkImage,
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
