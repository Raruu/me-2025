import { useContext, useEffect, useRef, useState } from "react";
import { TextRotate, TextRotateRef } from "./TextRotate";
import { Icon } from "@iconify/react";
import { mediaQueryContext } from "@/hooks/useMediaQuery";
import { seeMeeItems } from "@/configs/SeeMeeItems";

export interface SeeMeeItemProps {
  iconify: string;
  iconifyStyle?: React.CSSProperties;
  texts: string[];
  textColor?: string;
  bgColor?: string;
  href: string;
}

export const SeeMeeItem = ({
  iconify,
  iconifyStyle,
  texts,
  textColor = "var(--foreground)",
  bgColor = "var(--background-tr)",
  href,
}: SeeMeeItemProps) => {
  const duration = 700;
  const textRotateRef = useRef<TextRotateRef>({ setAnimAt: () => {} });
  const [isHover, setIsHover] = useState(false);
  const mediaQuery = useContext(mediaQueryContext);

  useEffect(() => {
    if (isHover) textRotateRef.current?.setAnimAt?.(0);
  }, [isHover]);

//   useEffect(() => {
//     setIsHover(true);
//     setTimeout(() => {
//       setIsHover(false);
//     }, 500);
//   }, [mediaQuery]);

  return (
    <div
      className="relative flex rounded-lg cursor-pointer"
      style={{ clipPath: "margin-box" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
           w-full h-full z-10 transition-all rounded-lg"
        style={{
          height: isHover ? "100%" : "70%",
          transitionDuration: `${duration / 5}ms`,
          backgroundColor: bgColor,
        }}
      ></div>
      <div className="z-20" onClick={() => window.open(href, "_blank")}>
        <TextRotate
          prefix={
            <Icon
              className="inline-flex w-full min-w-5 min-h-5"
              style={{
                marginLeft: isHover ? "8px" : "0px",
                marginTop: isHover ? "-6px" : "-3px",
                ...iconifyStyle,
              }}
              icon={iconify}
            />
          }
          texts={isHover ? texts : [""]}
          nextDelay={isHover ? duration : 0}
          animDuration={isHover ? duration : 0}
          rotateBgColor={bgColor}
          ref={textRotateRef}
          mediaQuery={mediaQuery}
          rotateTextColor={textColor}
        />
      </div>
    </div>
  );
};

export const SeeMee = () => {
  const [indexHovered, setIndexHovered] = useState(-1);
  return (
    <div className="flex flex-row items-center justify-center w-full h-full gap-4">
      {seeMeeItems.map((item, index) => (
        <div
          key={index}
          onMouseEnter={() => setIndexHovered(index)}
          onMouseLeave={() => setIndexHovered(-1)}
          className={`transition-all duration-500
           ${
             indexHovered === index
               ? ""
               : indexHovered > -1
               ? "blur-sm"
               : "blur-0"
           }`}
        >
          <SeeMeeItem {...item} />
        </div>
      ))}
    </div>
  );
};
