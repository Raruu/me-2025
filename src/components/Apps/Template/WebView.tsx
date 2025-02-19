import { useContext, useEffect, useState } from "react";
import { WindowContext } from "@/components/Window/Window";
import { SilhouetteBackground } from "@/components/ui/Background/SilhouetteBackground";
import { themeTrImage } from "@/utils/picture-helper";

interface WebViewProps {
  url: string;
  freeSlot?: React.ReactNode;
}

export const WebView = ({ url, freeSlot }: WebViewProps) => {
  const { setFreeSlot } = useContext(WindowContext);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setFreeSlot(freeSlot);
  }, [freeSlot, setFreeSlot]);

  return (
    <div className="w-full h-full flex bg-background">
      {!isLoaded && <SilhouetteBackground show={true} imgUrl={themeTrImage} />}
      <iframe
        className="w-full h-full"
        src={url}
        onLoad={() => setIsLoaded(true)}
        allowFullScreen
      ></iframe>
    </div>
  );
};
