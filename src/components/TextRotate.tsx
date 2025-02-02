import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { RefObject, useEffect, useRef, useState } from "react";

export type TextRotateRef = {
  setAnimAt: (at: number) => void;
};

interface TextRotateProps {
  ref?: RefObject<TextRotateRef>;
  mediaQuery?: MediaQuery;
  prefix: React.ReactNode;
  texts: string[];
  animFrom?: "start" | "end";
  animDuration?: number;
  nextDelay?: number;
  displayDuration?: number;
  rotateBgColor?: string;
  rotateTextColor?: string;
}

export const TextRotate = ({
  ref,
  mediaQuery,
  prefix,
  texts,
  animFrom = "start",
  animDuration = 700,
  nextDelay = 2000,
  displayDuration = 1000,
  rotateBgColor = "var(--foreground)",
  rotateTextColor = "var(--background)",
}: TextRotateProps) => {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [isDisplaying, setIsDisplaying] = useState(true);
  const [isFromStart, setIsFromStart] = useState(false);
  const [totalCharWidth, setTotalCharWidth] = useState(0);
  const rotatingTextParentRef = useRef<HTMLDivElement>(null);
  const [requireReCalc, setRequireReCalc] = useState(false);

  useEffect(() => {
    setRequireReCalc(true);
  }, [mediaQuery]);

  useEffect(() => {
    if (!ref) return;
    const setAnimAt = (at: number) => {
      setTimeout(() => {
        setCurrentText(texts[at % texts.length]);
        setIsDisplaying(true);
      }, 10);
    };
    Object.assign(ref.current, { setAnimAt });
  }, [ref, texts]);

  useEffect(() => {
    if (!rotatingTextParentRef.current) return;
    const children = rotatingTextParentRef.current.children;
    if (!children) return;

    const parentPaddingLeft =
      parseFloat(getComputedStyle(rotatingTextParentRef.current).paddingLeft) ||
      0;
    const parentPaddingRight =
      parseFloat(
        getComputedStyle(rotatingTextParentRef.current).paddingRight
      ) || 0;
    let totalWidth = parentPaddingLeft + parentPaddingRight;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      totalWidth += child.getBoundingClientRect().width;
    }
    setTotalCharWidth(totalWidth);
  }, [currentText, mediaQuery]);

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
    }, nextDelay + animDuration + displayDuration);

    return () => clearInterval(interval);
  }, [animDuration, currentText, displayDuration, nextDelay, texts]);

  const animIndex = (index: number) => {
    const constant = 105;
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
        className={`text-lg font-bold flex whitespace-pre ${
          mediaQuery
            ? mapMediaQuery(mediaQuery, { sm: "text-xl", md: "text-2xl" })
            : "sm:text-xl md:text-2xl"
        }`}
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
        >
          {prefix}{" "}
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
            width: totalCharWidth,
            opacity: (currentText?.length ?? 0) === 0 ? 0 : 1,
            marginLeft: (currentText?.length ?? 0) === 0 ? -totalCharWidth : "",
          }}
          onTransitionEnd={() => {
            if (requireReCalc) {
              setRequireReCalc(false);
              const index = texts.indexOf(currentText);
              setCurrentText(texts[texts.length - 1]);
              setTimeout(() => {
                setCurrentText(texts[index >= texts.length ? 0 : index]);
              }, 1);
            }
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
