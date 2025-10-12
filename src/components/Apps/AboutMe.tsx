import { TextRotate } from "../TextRotate";
import { AzusaBounce } from "../AzusaBounce";
import { SeeMee } from "../SeeMee";
import { mediaQueryContext } from "@/hooks/useMediaQuery";
import { useElementSize } from "@/hooks/useElementSize";
import { createRef } from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import { seeMeeItems } from "@/constants/SeeMeeItems";

const AboutMe = () => {
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
          <h1 className="text-sm font-bold">
            I code, see my real face in <span className="text-blue-400"><a href={seeMeeItems[1].href}>LinkedIn</a></span>
          </h1>
          <div className="h-2"></div>
          <SeeMee />
          <div className="h-2"></div>
          <h1 className="text-xs italic">Build this site brick by brick</h1>
        </div>
      </mediaQueryContext.Provider>
    </div>
  );
};

export const launcherAboutMe: WindowLauncherProps = {
  title: `Me`,
  initialSubtitle: "Student",
  appId: "me",
  icon: "raruu:azusa-cat",
  content: <AboutMe />,
  size: {
    width: 450,
    height: 450,
  },
  minSize: {
    width: 0,
    height: 0,
  },
  launcherRef: createRef(),
};
