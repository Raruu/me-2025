"use client";
import { createContext } from "react";

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
  value,
}: {
  children: React.ReactNode;
  value: ServerContextType;
}) => <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
