import { TaskbarPlacement } from "@/components/ui/Taskbar/Taskbar";
import { db } from "@/lib/db";
import { EtcContextType } from "@/lib/Etc";
import { initTheme, reducer as themeReducer } from "@/styles/theme";
import { useEffect, useReducer, useState } from "react";

export const useEtc = (): EtcContextType => {
  //   TaskBar
  const [taskbarPlacement, setTaskbarPlacement] =
    useState<TaskbarPlacement>("bottom");
  const [taskbarisExpanded, setTaskbarIsExpanded] = useState(false);

  useEffect(() => {
    const readTaskbarSettings = async () => {
      const file = await db.loadFile("taskbarSettings");
      if (file) {
        const text = await file.blob.text();
        const lines = text.split("\n");
        for (const line of lines) {
          const [key, value] = line.split("=");
          if (key === "taskbarPlacement") {
            setTaskbarPlacement(value as TaskbarPlacement);
          } else if (key === "isExpanded") {
            setTaskbarIsExpanded(value === "true");
          }
        }
      }
    };
    readTaskbarSettings();
  }, []);
  useEffect(() => {
    const saveTaskbarSettings = () => {
      const text =
        `taskbarPlacement=${taskbarPlacement}\n` +
        `isExpanded=${taskbarisExpanded}`;
      db.saveFile(
        "taskbarSettings",
        "taskbar.conf",
        "etc",
        new Blob([text], { type: "text/plain" })
      );
    };
    saveTaskbarSettings();
  }, [taskbarPlacement, taskbarisExpanded]);

  // Theme
  const [theme, setTheme] = useReducer(themeReducer, "dark");
  useEffect(() => {
    setTheme(initTheme());
  }, []);

  return {
    taskbarSettings: {
      taskbarPlacement: taskbarPlacement,
      setTaskbarPlacement: setTaskbarPlacement,
      isExpanded: taskbarisExpanded,
      setIsExpanded: setTaskbarIsExpanded,
    },
    themeSettings: {
      theme: theme,
      setTheme: setTheme,
    }
  };
};
