import NextImage from "next/image";
import { useId } from "react";

interface SilhouetteBackgroundProps {
  show: boolean;
  imgUrl: string;
  style?: React.CSSProperties;
  minusZIndex?: boolean;
}

export const SilhouetteBackground = ({
  show,
  imgUrl,
  style,
  minusZIndex,
}: SilhouetteBackgroundProps) => {
  const filterId = useId();

  return show ? (
    <div
      className={`absolute pointer-events-none w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      flex items-center justify-center overflow-hidden ${
        minusZIndex ? "-z-10" : ""
      }`}
    >
      <svg className="absolute w-0 h-0">
        <filter id={filterId}>
          <feFlood floodColor="var(--foreground)" result="flood" />
          <feComposite in="flood" in2="SourceAlpha" operator="in" />
        </filter>
      </svg>
      <NextImage
        className="transition-all duration-300 w-1/3 h-auto"
        src={imgUrl}
        style={{
          filter: `url(#${filterId})`,
          ...style,
        }}
        width={0}
        height={0}
        priority={true}
        alt="Colorized animated"
        unoptimized
      />
    </div>
  ) : null;
};
