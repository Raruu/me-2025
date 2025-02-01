import { mapMediaQuery, mediaQueryContext } from "@/hooks/useElementSize";
import { azusaCatImage, notice1Image } from "@/utils/picture-helper";
import NextImage from "next/image";
import { useContext, useState } from "react";

export const AzusaBounce = () => {
  const [isHover, setIsHover] = useState(false);
  const mediaQuery = useContext(mediaQueryContext);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <NextImage
        className={`transition-opacity duration-150 ${
          isHover ? "opacity-100 animate-wiggle" : "opacity-0"
        }`}
        src={notice1Image}
        style={{
          width: "30px",
          height: "auto",
          position: "absolute",
          left: -5,
          top: mapMediaQuery(mediaQuery, { default: "-10px", sm: "20px" }),  
          rotate: mapMediaQuery(mediaQuery, { default: "15deg", sm: "5deg" }),  
        }}
        alt="Notice 1"
        width={100}
        height={0}
      />
      <NextImage
        className={isHover ? "animate-bounce-small" : ""}
        src={azusaCatImage}
        style={{ width: "100%", height: "auto" }}
        alt="Azusa Bounce"
        width={parseInt(
          mapMediaQuery(mediaQuery, {
            default: "100",
            md: "250",
            sm: "200",
          })
        )}
        height={0}
      />
    </div>
  );
};
