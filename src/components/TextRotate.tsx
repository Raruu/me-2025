import { useEffect, useRef, useState } from "react";

interface TextRotateProps {
  textPrefix: string;
  texts: string[];
  animFrom?: "start" | "end";
  animDuration?: number;
  nextDelay?: number;
  displayDuration?: number;
}

export const TextRotate = ({
  textPrefix,
  texts,
  animFrom = "start",
  animDuration = 700,
  nextDelay = 2000,
  displayDuration = 1000,
}: TextRotateProps) => {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [isDisplaying, setIsDisplaying] = useState(true);
  const [isFromStart, setIsFromStart] = useState(false);
  const [totalCharWidth, setTotalCharWidth] = useState(0);
  const rotatingTextParentRef = useRef<HTMLDivElement>(null);

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
  }, [currentText]);

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
    const constant = 100;
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
      <p className="text-2xl font-bold flex whitespace-pre">
        <span className="pt-0.5 sm:pt-1 md:pt-2">{textPrefix} </span>
        <span
          ref={rotatingTextParentRef}
          className="inline-flex whitespace-pre-wrap text-[--background] bg-foreground transition-all
      px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-2 rounded-lg overflow-hidden "
          style={{
            transitionDuration: `${animDuration}ms`,
            width: totalCharWidth,
          }}
        >
          {currentText.split("").map((char, index) => (
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
        </span>
      </p>
    </div>
  );
};