"use client";

import { WindowManager } from "@/components/Window/WindowManager";
import { useEtc } from "@/hooks/useEtc";
import { initFileSystem } from "@/lib/db";
import { EtcContext } from "@/lib/Etc";
import { raruuIconify } from "@/styles/raruu-iconify";
import { LoadRequiredImage } from "@/utils/picture-helper";
import { useEffect } from "react";

export default function Home() {
  const etcContext = useEtc();
  LoadRequiredImage();
  useEffect(() => {
    initFileSystem();
    raruuIconify();
  }, []);

  return (
    <EtcContext.Provider value={etcContext}>
      <WindowManager />
    </EtcContext.Provider>
  );
}
