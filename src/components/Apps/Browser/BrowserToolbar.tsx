import { useContext, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { WindowContext } from "@/components/Window/Window";
import { useBrowser } from "./BrowserContext";

export const BrowserToolbar = () => {
  const windowContext = useContext(WindowContext);
  const {
    inputUrl,
    setInputUrl,
    isLoading,
    canGoBack,
    canGoForward,
    url,
    showStartPage,
    useProxy,
    setUseProxy,
    handleNavigate,
    handleGoBack,
    handleGoForward,
    handleRefresh,
    handleHome,
    toolbarInside,
  } = useBrowser();

  const toolbarContent = (
    <div className={`flex items-center gap-2 px-2 ${toolbarInside ? "py-2" : ""}`}>
      <button
        onClick={handleGoBack}
        disabled={!canGoBack}
        className={`p-1 rounded hover:bg-foreground/10 ${
          !canGoBack ? "opacity-30 cursor-not-allowed" : ""
        }`}
        title="Go Back"
      >
        <Icon icon="mdi:arrow-left" className="w-4 h-4" />
      </button>
      <button
        onClick={handleGoForward}
        disabled={!canGoForward}
        className={`p-1 rounded hover:bg-foreground/10 ${
          !canGoForward ? "opacity-30 cursor-not-allowed" : ""
        }`}
        title="Go Forward"
      >
        <Icon icon="mdi:arrow-right" className="w-4 h-4" />
      </button>
      <button
        onClick={handleRefresh}
        className="p-1 rounded hover:bg-foreground/10"
        title="Refresh"
      >
        <Icon
          icon={isLoading ? "mdi:loading" : "mdi:refresh"}
          className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
        />
      </button>
      <button
        onClick={handleHome}
        className="p-1 rounded hover:bg-foreground/10"
        title="Home"
      >
        <Icon icon="mdi:home" className="w-4 h-4" />
      </button>
      <button
        onClick={() => setUseProxy(!useProxy)}
        className={`p-1 rounded hover:bg-foreground/10 ${
          useProxy ? "bg-blue-500/20" : ""
        }`}
        title={
          useProxy
            ? "Proxy Mode: ON (bypasses some restrictions)"
            : "Proxy Mode: OFF (click to enable)"
        }
      >
        <Icon icon="mdi:shield-lock" className="w-4 h-4" />
      </button>
      {!showStartPage && (
        <button
          onClick={() => window.open(url, "_blank")}
          className="p-1 rounded hover:bg-foreground/10"
          title="Open in New Tab"
        >
          <Icon icon="mdi:open-in-new" className="w-4 h-4" />
        </button>
      )}
      <form
        onSubmit={handleNavigate}
        className="flex items-center flex-1 min-w-0"
      >
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="flex-1 px-3 py-1 text-sm rounded-full placeholder-foreground/70 text-foreground bg-foreground/5 border border-foreground/10 focus:outline-none focus:border-foreground/30 min-w-0"
          placeholder="Enter URL or search..."
        />
      </form>
    </div>
  );

  useEffect(() => {
    if (!windowContext?.setFreeSlot) return;

    if (toolbarInside) {
      windowContext.setFreeSlot(null);
    } else {
      windowContext.setFreeSlot(toolbarContent);
    }
  }, [
    inputUrl,
    isLoading,
    canGoBack,
    canGoForward,
    url,
    showStartPage,
    useProxy,
    handleNavigate,
    handleGoBack,
    handleGoForward,
    handleRefresh,
    handleHome,
    setInputUrl,
    setUseProxy,
    toolbarInside,
  ]);

  return toolbarInside ? toolbarContent : null;
};
