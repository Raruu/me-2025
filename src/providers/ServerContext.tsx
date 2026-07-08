"use client";
import { BaseExternalResource } from "@/constants/ExternalResources";
import { createContext, useMemo } from "react";

type Work = {
  title: string;
  img: string[];
  year: number;
  tags: string[];
  desc: string;
  desc_long?: string;
  repo?: string;
  liveProject?: string;
};

type cv = {
  cv_id: string;
};

type ServerContextType = { myWorks: Work[]; cv: cv };

export const ServerContext = createContext<ServerContextType>({
  myWorks: [],
  cv: { cv_id: "" },
});

export const ServerProvider = ({
  children,
  myWorks,
  cv,
}: {
  children: React.ReactNode;
  myWorks: Work[];
  cv: cv;
}) => {
  const value = useMemo<ServerContextType>(() => {
    const parsedMyWorks = myWorks.map((work) => ({
      ...work,
      img: work.img.map((path) => `${BaseExternalResource}${path}`),
    }));

    const parsedCv = { ...cv, cv_id: `${BaseExternalResource}${cv.cv_id}` };

    return { myWorks: parsedMyWorks, cv: parsedCv };
  }, [myWorks, cv]);

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
};
