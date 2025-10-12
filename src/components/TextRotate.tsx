import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export type TextRotateRef = {
  setAnimAt?: (at: number) => void;
  reCaclSize?: () => void;
};

interface TextRotateProps {
  ref?: RefObject<TextRotateRef>;
  mediaQuery?: MediaQuery;
  prefix: React.ReactNode | string;
  texts: string[];
  animFrom?: "start" | "end";
  animDuration?: number;
  nextDelay?: number;
  rotateBgColor?: string;
  rotateTextColor?: string;
  textSize?: number;
  textLineHeight?: number;
  spacing?: number;
  skip?: boolean;
}

export const TextRotate = ({
  ref,
  mediaQuery,
  prefix,
  texts,
  animFrom = "start",
  animDuration = 700,
  nextDelay = 3000,
  rotateBgColor = "oklch(var(--foreground))",
  rotateTextColor = "oklch(var(--background))",
  textSize,
  textLineHeight,
  spacing,
  skip = false,
}: TextRotateProps) => {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [isDisplaying, setIsDisplaying] = useState(true);
  const [isFromStart, setIsFromStart] = useState(false);
  const [totalCharWidth, setTotalCharWidth] = useState(0);
  const rotatingTextParentRef = useRef<HTMLDivElement & { paddingLR: number }>(
    null
  );

  const sumPaddingLeftRight = () => {
    if (!rotatingTextParentRef.current) return;
    const parentPaddingLeft =
      parseFloat(getComputedStyle(rotatingTextParentRef.current).paddingLeft) ||
      0;
    const parentPaddingRight =
      parseFloat(
        getComputedStyle(rotatingTextParentRef.current).paddingRight
      ) || 0;
    const total = parentPaddingLeft + parentPaddingRight;
    rotatingTextParentRef.current.paddingLR = total;
    return total;
  };

  const calc = useCallback(() => {
    if ((currentText?.length ?? 0) === 0) {
      setTotalCharWidth(0);
      return;
    }
    if (!rotatingTextParentRef.current) return;
    const children = rotatingTextParentRef.current.children;
    if (!children) return;
    let totalWidth = rotatingTextParentRef.current.paddingLR;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      totalWidth += child.getBoundingClientRect().width;
    }
    setTotalCharWidth(totalWidth);
    // console.log("totalWidth", totalWidth);
  }, [currentText]);

  useEffect(() => {
    if(!skip) return;
    setTimeout(() => {
      calc();
    }, animDuration);
  }, [animDuration, calc, skip]);

  useEffect(() => {
    if (totalCharWidth === 0) calc();
    setTimeout(() => {
      sumPaddingLeftRight();
      calc();
    }, animDuration);
  }, [animDuration, calc, currentText, mediaQuery, totalCharWidth]);

  useEffect(() => {
    if (!ref) return;
    const setAnimAt = (at: number) => {
      setTimeout(() => {
        setCurrentText(texts[at % texts.length]);
        setIsDisplaying(true);
      }, 10);
    };
    ref.current.setAnimAt = setAnimAt;
    ref.current.reCaclSize = () => {
      sumPaddingLeftRight();
      calc();
    };
  }, [calc, ref, texts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFromStart(false);
      setIsDisplaying(false);
      setTimeout(() => {
        setCurrentText(texts[(texts.indexOf(currentText) + 1) % texts.length]);
        setIsFromStart(true);
        setTimeout(() => {
          setIsDisplaying(true);
        }, animDuration / 2);
      }, animDuration / 2);
    }, nextDelay + animDuration);

    return () => clearInterval(interval);
  }, [animDuration, currentText, nextDelay, texts]);

  const animIndex = (index: number) => {
    const constant = 175;
    const calcFromLast = (index: number) =>
      (currentText.length - index + 1) * constant;
    const calcFromStart = (index: number) => (index + 1) * constant;
    return animFrom === "start"
      ? isFromStart
        ? calcFromStart(index)
        : calcFromLast(index)
      : isFromStart
      ? calcFromLast(index)
      : calcFromStart(index);
  };

  return (
    <div className="flex flex-row">
      <p
        className={`font-bold flex whitespace-pre ${
          mediaQuery
            ? mapMediaQuery(mediaQuery, {
                default: "text-lg",
                sm: "text-xl",
                md: "text-2xl",
              })
            : "text-lg sm:text-xl md:text-2xl"
        }`}
        style={{
          fontSize: textSize,
          lineHeight: textLineHeight,
        }}
      >
        <span
          className={
            mediaQuery
              ? mapMediaQuery(mediaQuery, {
                  sm: "pt-1",
                  md: "pt-2",
                  default: "pt-0.5",
                })
              : "pt-0.5 sm:pt-1 md:pt-2"
          }
          style={{ marginRight: spacing }}
        >
          {typeof prefix === "string" ? <span>{prefix}</span> : prefix}{" "}
        </span>
        <span
          ref={rotatingTextParentRef}
          className={`inline-flex whitespace-pre transition-all rounded-lg overflow-hidden 
            ${
              mediaQuery
                ? mapMediaQuery(mediaQuery, {
                    sm: "px-2 py-1",
                    md: "px-3 py-2",
                    default: "px-2 py-0.5",
                  })
                : "px-2 py-0.5 sm:py-1 md:px-3 md:py-2"
            }`}
          style={{
            color: rotateTextColor,
            backgroundColor: rotateBgColor,
            transitionDuration: `${animDuration}ms`,
            width: skip ? "" : totalCharWidth > 0 ? totalCharWidth : "0px",
            opacity:
              totalCharWidth > 0
                ? (currentText?.length ?? 0) === 0
                  ? 0
                  : 1
                : 0,
            marginLeft:
              (currentText?.length ?? 0) === 0
                ? rotatingTextParentRef.current
                  ? -rotatingTextParentRef.current.paddingLR
                  : ""
                : "",
          }}
        >
          {currentText.length > 0 &&
            currentText.split("").map((char, index) => (
              <span
                className={`inline-block ${
                  isFromStart && !isDisplaying
                    ? "transition-none"
                    : "transition-transform"
                }`}
                key={index}
                style={{
                  transitionDuration: `${animDuration}ms`,
                  transform: isDisplaying
                    ? `translateY(0%)`
                    : isFromStart
                    ? `translateY(${animIndex(index)}%)`
                    : `translateY(-${animIndex(index)}%)`,
                }}
              >
                {char}
              </span>
            ))}
          {currentText.length === 0 && <span className="opacity-0">.</span>}
        </span>
      </p>
    </div>
  );
};
