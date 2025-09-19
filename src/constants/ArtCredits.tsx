import {
  azusaCatImage,
  bgHzDarkImage,
  bgHzLightImage,
  bgVerDarkImage,
  bgVerLightImage,
  patapataLanuBiscuit,
  themeTrImage,
} from "@/utils/picture-helper";

type Arts = {
  linkWhereIFoundThisArt?: string;
  imgAssetPath: string;
  aiGenerated?: boolean;
};

type Artist = {
  artistName: string;
  arts?: Arts[];
  socialMedia: {
    pixiv?: string;
    x?: string;
  };
  socialMediaComents?: {
    pixiv?: string[];
    x?: string[];
  };
};

export const artCredits: Artist[] = [
  {
    artistName: "秋麒麟热茶",
    socialMedia: {
      pixiv: "https://www.pixiv.net/en/users/42380474",
    },
    socialMediaComents: {
      pixiv: ["42380474"],
    },
    arts: [
      {
        linkWhereIFoundThisArt: "https://www.pixiv.net/en/artworks/125257812",
        imgAssetPath: azusaCatImage,
      },
    ],
  },
  {
    artistName: "LanuBis💜",
    socialMedia: {
      x: "https://x.com/Lanubiscuit",
      pixiv: "https://www.pixiv.net/en/users/8356474",
    },
    socialMediaComents: {
      x: ["@Lanubiscuit"],
      pixiv: ["8356474"],
    },
    arts: [
      {
        linkWhereIFoundThisArt: "https://www.youtube.com/watch?v=yBB0HSWBf2M",
        imgAssetPath: themeTrImage,
      },
      {
        linkWhereIFoundThisArt: "https://danbooru.donmai.us/posts/6018576",
        imgAssetPath: patapataLanuBiscuit,
      },
    ],
  },
  {
    artistName: "なぞはむ（もみぃ）",
    socialMedia: {
      pixiv: "https://www.pixiv.net/en/users/4382415",
    },
    socialMediaComents: {
      pixiv: ["4382415"],
    },
    arts: [
      {
        linkWhereIFoundThisArt: "https://www.pixiv.net/en/artworks/126556767",
        imgAssetPath: bgVerLightImage,
        aiGenerated: true,
      },
    ],
  },
  {
    artistName: "Alens",
    socialMedia: {
      pixiv: "https://www.pixiv.net/en/users/18898196",
      x: "https://x.com/Alens454635",
    },
    socialMediaComents: {
      pixiv: ["18898196"],
      x: ["@Alens454635"],
    },
    arts: [
      {
        linkWhereIFoundThisArt: "https://www.pixiv.net/en/artworks/113970581",
        imgAssetPath: bgVerDarkImage,
        aiGenerated: true,
      },
    ],
  },
  {
    artistName: "???",
    socialMedia: {},
    arts: [
      {
        imgAssetPath: bgHzDarkImage,
      },
      {
        imgAssetPath: bgHzLightImage,
      },
    ],
  },
];
