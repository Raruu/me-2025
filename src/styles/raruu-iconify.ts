"use client";

import {
  azusaCatImage,
  iconMidokuniLogo512,
  patapataLanuBiscuit,
} from "@/utils/picture-helper";
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
      "ic-midokuni-logo-512": {
        body: `<image href="${iconMidokuniLogo512}" height="24" width="24"/>`,
        height: 24,
        width: 24,
      },
      "ic-midokuni-logo-512-document": {
        // fluent:document-16-filled
        body: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="white" d="M8 1v3.5A1.5 1.5 0 0 0 9.5 6H13v7.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-11A1.5 1.5 0 0 1 4.5 1zm1 .25V4.5a.5.5 0 0 0 .5.5h3.25z"></path> <image href="${iconMidokuniLogo512}" height="20" width="8" x="4" y="0"/> </svg>`,
        height: 24,
        width: 24,
      },
      "devicon-linkedin": {
        body: '<path fill="#0a66c2" d="M116 3H12a8.91 8.91 0 0 0-9 8.8v104.42a8.91 8.91 0 0 0 9 8.78h104a8.93 8.93 0 0 0 9-8.81V11.77A8.93 8.93 0 0 0 116 3"/><path fill="#fff" d="M21.06 48.73h18.11V107H21.06zm9.06-29a10.5 10.5 0 1 1-10.5 10.49a10.5 10.5 0 0 1 10.5-10.49m20.41 29h17.36v8h.24c2.42-4.58 8.32-9.41 17.13-9.41C103.6 47.28 107 59.35 107 75v32H88.89V78.65c0-6.75-.12-15.44-9.41-15.44s-10.87 7.36-10.87 15V107H50.53z"/>',
        height: 128,
        width: 128,
      },
      "sensei-laptop": {
        body: '<image href="/icon/sensei-laptop.webp" height="24" width="24"/>',
        height: 24,
        width: 24,
      },
    },
  });
