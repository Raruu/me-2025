"use client";

import { WindowManager } from "@/components/Window/WindowManager";
import { useEtc } from "@/hooks/useEtc";
import { initFileSystem } from "@/lib/db";
import { EtcContext } from "@/lib/Etc";
import { raruuIconify } from "@/styles/raruu-iconify";
import { LoadRequiredImage } from "@/utils/picture-helper";
import { useEffect, useState } from "react";

export default function Home() {
  const etcContext = useEtc();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    LoadRequiredImage().then(() => {
      initFileSystem().then((value) => {
        setIsReady(value);
      });
    });
    raruuIconify();
  }, []);

  return (
    <EtcContext.Provider value={etcContext}>
      {isReady && <WindowManager />}
    </EtcContext.Provider>
  );
}
