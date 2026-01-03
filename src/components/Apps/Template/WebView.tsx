import { useContext, useEffect, useState } from "react";
import { SilhouetteBackground } from "@/components/ui/Background/SilhouetteBackground";
import { EtcContext } from "@/lib/Etc/Etc";
import { WindowContext } from "@/providers/WindowContext";

interface WebViewProps {
  url: string;
  freeSlot?: React.ReactNode;
  isLoading?: boolean;
}

export const WebView = ({ url, freeSlot, isLoading = false }: WebViewProps) => {
  const { setFreeSlot } = useContext(WindowContext);
  const { silhouetteTr } = useContext(EtcContext).themeSettings;
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setFreeSlot(freeSlot);
  }, [freeSlot, setFreeSlot]);

  return (
    <div className="w-full h-full flex bg-background">
      {(!isLoaded || isLoading) && (
        <SilhouetteBackground show={true} imgUrl={silhouetteTr} />
      )}
      <iframe
        className="w-full h-full"
        src={url}
        onLoad={() => setIsLoaded(true)}
        allowFullScreen
      ></iframe>
    </div>
  );
};
