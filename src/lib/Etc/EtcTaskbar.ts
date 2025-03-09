import {
  EtcTaskbarSettings,
  TaskbarPlacement,
} from "@/components/ui/Taskbar/Taskbar";
import { useEffect, useState } from "react";
import { db } from "../db";

export const EtcTaskbar = (): EtcTaskbarSettings => {
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

  return {
    taskbarPlacement: taskbarPlacement,
    setTaskbarPlacement: setTaskbarPlacement,
    isExpanded: taskbarisExpanded,
    setIsExpanded: setTaskbarIsExpanded,
  };
};
