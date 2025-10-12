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

type ServerContextType = { myWorks: Work[] };

export const ServerContext = createContext<ServerContextType>({
  myWorks: [],
});

export const ServerProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ServerContextType;
}) => <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
