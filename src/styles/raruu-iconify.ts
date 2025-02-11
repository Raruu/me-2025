"use client";

import { azusaCatImage, patapataLanuBiscuit } from "@/utils/picture-helper";
import { addCollection } from "@iconify/react";

export const raruuIconify = () =>
  addCollection({
    prefix: "raruu",
    icons: {
      "azusa-cat": {
        body: `<image href="${azusaCatImage}" height="24" width="24"/>`,
        height: 24,
        width: 24,
      },
      "patapata-lanubiscuit": {
        body: `<image href="${patapataLanuBiscuit}" height="24" width="24"/>`,
        height: 24,
        width: 24,
      },
      "devicon-linkedin": {
        body: '<path fill="#0a66c2" d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3"/><path fill="#fff" d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"/>',
        height: 128,
        width: 128,
      },
    },
  });
