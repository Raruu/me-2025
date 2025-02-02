"use client";

import { useId, useEffect, useContext, useState, useCallback } from "react";
import NextImage from "next/image";
import { themeContext, themeType } from "@/styles/theme";
import {
  themeTrImage,
  bgHzLightImage,
  bgHzDarkImage,
  bgVerLightImage,
  bgVerDarkImage,
} from "@/utils/picture-helper";
import { mapMediaQuery, useMediaQuery } from "@/hooks/useMediaQuery";

interface BackgroundUwUProps {
  statusBarRef: React.RefObject<HTMLDivElement>;
  taskBarRef: React.RefObject<HTMLDivElement>;
}

export const BackgroundUwU = ({
  statusBarRef,
  taskBarRef,
}: BackgroundUwUProps) => {
  const mediaQuery = useMediaQuery();
  const filterId = useId();
  const [bgUrl, setBgUrl] = useState(themeTrImage);
  const { theme, setTheme } = useContext(themeContext);
  const [show, setShow] = useState(false);
  const [resizing, setIsAnimating] = useState(false);

  const changeBackground = useCallback(
    (tmpTheme?: themeType) => {
      tmpTheme = tmpTheme ?? theme;
      if(tmpTheme.includes("tr-")) return;
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
    [mediaQuery, theme]
  );

  useEffect(() => {
    if(bgUrl === themeTrImage) return;
    changeBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaQuery]);

  useEffect(() => {
    if (!theme.includes("tr-")) return;
    setShow(true);
    const taskbarBg = Array.from(taskBarRef.current?.children || []).filter(
      (child) => (child as HTMLElement).id === "taskbar-bg"
    )[0] as HTMLElement;
    taskbarBg.style.opacity = "0";
    setTimeout(() => {
      setTimeout(() => {
        const tmpTheme = theme.replace("tr-", "") as themeType;
        setTheme(tmpTheme);
        changeBackground(tmpTheme);
        taskbarBg.style.opacity = "";
        setShow(false);
        setIsAnimating(false);
      }, 150);
      setIsAnimating(true);
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTheme, theme]);

  return (
    <div className="bg-background fixed top-0 left-0 right-0 bottom-0 -z-10">
      <div
        className="transition-all duration-300 w-full h-full "
        style={{ opacity: show ? 0 : 1 }}
      >
        <div
          className="w-full bg-[var(--taskbar-bg)] backdrop-blur -z-10 transition-colors"
          style={{
            height: statusBarRef.current?.clientHeight || 0,
          }}
        ></div>
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

      <div
        className={`${
          show ? "fixed" : "hidden"
        } pointer-events-none w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center -z-10`}
      >
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feFlood floodColor="var(--foreground)" result="flood" />
            <feComposite in="flood" in2="SourceAlpha" operator="in" />
          </filter>
        </svg>
        <NextImage
          className="transition-all duration-300 w-1/3 h-auto"
          src={themeTrImage}
          style={{
            filter: `url(#${filterId})`,
            width: resizing ? "calc(100vw + 100vh)" : "40vh",
            height: "auto",
          }}
          width={0}
          height={0}
          priority={true}
          alt="Colorized animated"
          unoptimized
        />
      </div>
    </div>
  );
};
