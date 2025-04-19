"use client";

export const themeTrImage = "/azusa-dance.webp";
export const bgHzLightImage = "/hz-background-light.webp";
export const bgVerLightImage = "/ver-background-light.webp";
export const bgHzDarkImage = "/hz-background-dark.webp";
export const bgVerDarkImage = "/ver-background-dark.webp";
export const azusaCatImage = "/me-azusa.webp";
export const noticeAzusaCatImage = "/notice-1.webp";
export const patapataLanuBiscuit = "/patapata-lanubiscuit.webp";
export const iconMidokuniLogo512 = "/icon/midokuni_logo_512.webp";

export const LoadRequiredImage = async (): Promise<boolean> => {
  const imagesToPreload = [
    themeTrImage,
    bgHzLightImage,
    bgHzDarkImage,
    bgVerLightImage,
    bgVerDarkImage,
  ];

  const loadPromises = imagesToPreload.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  });

  try {
    await Promise.all(loadPromises);
    return true;
  } catch {
    return false;
  }
};
