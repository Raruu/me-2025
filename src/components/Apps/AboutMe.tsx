import { TextRotate } from "../TextRotate";
import { AzusaBounce } from "../AzusaBounce";
import { SeeMee } from "../SeeMee";
import { mediaQueryContext } from "@/hooks/useMediaQuery";
import { useElementSize } from "@/hooks/useElementSize";

export const AboutMe = () => {
  const { mediaQuery, elementRef } = useElementSize();

  return (
    <div
      ref={elementRef}
      className="flex flex-row items-center justify-center bg-background w-full h-full select-none overflow-auto"
    >
      <mediaQueryContext.Provider value={mediaQuery}>
        <div className="flex flex-col items-center">
          <AzusaBounce />
          <div className="h-4" />
          <TextRotate
            prefix="Hi, I'm"
            texts={["Widi", "Raruu", "ᓀ‸ᓂ"]}
            animFrom="end"
            nextDelay={2500}
            mediaQuery={mediaQuery}
          />
          <div className="h-2"></div>
          <h1 className="text-sm font-bold">I code, me trying react in early 2025 &gt;w&lt; </h1>
          <div className="h-2"></div>
          <SeeMee />
          <div className="h-2"></div>
          <h1 className="text-xs italic">Build this site brick by brick</h1>
        </div>
      </mediaQueryContext.Provider>
    </div>
  );
};
