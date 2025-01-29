"use client";

import { useId, useEffect, useContext, useState } from "react";
import Image from "next/image";
import { themeContext, themeType } from "@/styles/theme";

interface BackgroundUwUProps {
  statusBarRef: React.RefObject<HTMLDivElement>;
}

export const BackgroundUwU = ({ statusBarRef }: BackgroundUwUProps) => {
  const webPImage = "/azusa-dance.webp";
  const bgLightImage = "/background-light.webp";
  const bgDarkImage = "/background-dark.webp";
  const filterId = useId();
  const [bgUrl, setBgUrl] = useState(bgDarkImage);
  const { theme, setTheme } = useContext(themeContext);
  const [show, setShow] = useState(false);
  const [resizing, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!theme.includes("tr-")) return;
    setShow(true);
    setTimeout(() => {
      setTimeout(() => {
        const tmpTheme = theme.replace("tr-", "") as themeType;
        setTheme(tmpTheme);
        setBgUrl(tmpTheme === "light" ? bgLightImage : bgDarkImage);
        setShow(false);
        setIsAnimating(false);
      }, 150);
      setIsAnimating(true);
    }, 700);
  }, [setTheme, theme]);

  return (
    <div className="bg-background fixed top-0 left-0 right-0 bottom-0 -z-10">
      <div
        className="transition-all duration-300 w-full h-full "
        style={{ opacity: show ? 0 : 1 }}
      >
        <div
          className="w-full bg-[--taskbar-bg] backdrop-blur-z-10"
          style={{
            height: statusBarRef.current?.clientHeight || 0,
          }}
        ></div>
        <Image
          src={bgUrl}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
          style={{ width: "100%", height: "auto" }}
          width={0}
          height={0}
          unoptimized
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
        <Image
          className="transition-all duration-300 w-1/3 h-auto"
          src={webPImage}
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
