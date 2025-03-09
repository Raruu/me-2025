"use client";

import { useEffect, useContext, useState, useCallback } from "react";
import NextImage from "next/image";
import { themeType } from "@/styles/theme";
import { themeTrImage } from "@/utils/picture-helper";
import { mapMediaQuery, useMediaQuery } from "@/hooks/useMediaQuery";
import { WindowManagerContext } from "../../Window/WindowManager";
import { SilhouetteBackground } from "./SilhouetteBackground";
import { EtcContext } from "@/lib/Etc/Etc";

export const BackgroundUwU = () => {
  const { statusBarRef, taskBarRef } = useContext(WindowManagerContext);
  const mediaQuery = useMediaQuery();
  const [bgUrl, setBgUrl] = useState(themeTrImage);
  const { theme, setTheme } = useContext(EtcContext).themeSettings;
  const [show, setShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    bgHzUrlLight: bgHzLightImage,
    bgHzUrlDark: bgHzDarkImage,
    bgVerUrlLight: bgVerLightImage,
    bgVerUrlDark: bgVerDarkImage,
  } = useContext(EtcContext).themeSettings;

  const changeBackground = useCallback(
    (tmpTheme?: themeType) => {
      tmpTheme = tmpTheme ?? theme;
      if (tmpTheme.includes("tr-")) return;
      setBgUrl(
        tmpTheme === "light"
          ? mapMediaQuery(mediaQuery, {
              default: bgVerLightImage,
              sm: bgHzLightImage,
            })
          : mapMediaQuery(mediaQuery, {
              default: bgVerDarkImage,
              sm: bgHzDarkImage,
            })
      );
    },
    [
      bgHzDarkImage,
      bgHzLightImage,
      bgVerDarkImage,
      bgVerLightImage,
      mediaQuery,
      theme,
    ]
  );

  useEffect(() => {
    if (bgUrl === themeTrImage) return;
    changeBackground();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeBackground, mediaQuery]);

  useEffect(() => {
    if (!theme.includes("tr-")) return;
    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const doAnimation = async () => {
      setShow(true);
      const taskbarBg = Array.from(taskBarRef.current?.children || []).filter(
        (child) => (child as HTMLElement).id === "background-tr"
      )[0] as HTMLElement;
      taskbarBg.style.opacity = "0";

      await sleep(700);
      setIsAnimating(true);
      await sleep(150);
      const tmpTheme = theme.replace("tr-", "") as themeType;
      setTheme(tmpTheme);
      changeBackground(tmpTheme);
      taskbarBg.style.opacity = "";
      setShow(false);
      setIsAnimating(false);
    };

    doAnimation();
  }, [changeBackground, setTheme, taskBarRef, theme]);

  return (
    <div className="bg-background fixed top-0 left-0 right-0 bottom-0 -z-10">
      <div
        className="transition-all duration-300 w-full h-full "
        style={{ opacity: show ? 0 : 1 }}
      >
        {/* Statubar Bg */}
        <div
          className="w-full bg-background-tr backdrop-blur -z-10 transition-colors"
          style={{
            height: statusBarRef.current?.clientHeight || 0,
          }}
        ></div>

        {/* Wallpaper */}
        <NextImage
          src={bgUrl}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
          style={{ width: "100%", height: "auto" }}
          width={0}
          height={0}
          unoptimized
          priority
          alt="background Image"
        />
      </div>

      <SilhouetteBackground
        show={show}
        imgUrl={themeTrImage}
        style={{ width: isAnimating ? "calc(100vw + 100vh)" : "40vh" }}
        minusZIndex
      />
    </div>
  );
};
