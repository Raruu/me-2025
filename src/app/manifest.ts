import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Raruu 2K25",
    short_name: "Raruu",
    description: "Raruu's Personal Page from 2025",
    start_url: "/",
    display: "standalone",
    background_color: "#d6d6d6",
    theme_color: "#8b5cf6",
    orientation: "any",
    icons: [
      {
        src: "/pwa-icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/pwa-icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa-icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
