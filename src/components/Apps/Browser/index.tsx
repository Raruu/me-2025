import { createRef, useContext, useEffect } from "react";
import { WindowLauncherProps } from "../../ui/Taskbar/TaskbarItem";
import { Icon } from "@iconify/react/dist/iconify.js";
import { SilhouetteBackground } from "../../ui/Background/SilhouetteBackground";
import { EtcContext } from "@/lib/Etc";
import { BrowserProvider, useBrowser } from "./BrowserContext";
import { BrowserToolbar } from "./BrowserToolbar";
import { WindowContext } from "@/providers/WindowContext";

const quickLinks = [
  { name: "GitHub/Raruu", url: "https://github.com/Raruu", icon: "mdi:github" },
  {
    name: "cznull/vsbm",
    url: "https://cznull.github.io/vsbm",
    icon: "arcticons:geogebra",
  },
  {
    name: "This",
    url: typeof window !== "undefined" ? window.location.href : "",
    icon: "mingcute:terminal-box-line",
  },
];

const BrowserContent = () => {
  const { setSubtitle } = useContext(WindowContext);
  const { silhouetteTr } = useContext(EtcContext).themeSettings;

  const {
    url,
    setUrl,
    inputUrl,
    setInputUrl,
    isLoading,
    setIsLoading,
    showStartPage,
    loadError,
    setLoadError,
    useProxy,
    setUseProxy,
    handleQuickLink,
    handleNavigate,
    handleHome,
    getFinalUrl,
    elementRef,
  } = useBrowser();

  useEffect(() => {
    setSubtitle(url);
  }, [url, setSubtitle]);

  return (
    <>
      <div
        ref={elementRef}
        className="w-full h-full flex flex-col bg-background select-none"
      >
        <div className="flex-shrink-0 border-b border-foreground/10">
          <BrowserToolbar />
        </div>

        {showStartPage ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-auto">
            <div className="max-w-2xl w-full space-y-8">
              <div className="text-center space-y-4">
                <Icon icon="mdi:web" className="w-16 h-16 mx-auto opacity-60" />
                <h1 className="text-3xl font-bold">Browser</h1>
                <div className="max-w-xl mx-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (inputUrl.trim()) {
                        handleNavigate(e);
                      }
                    }}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="Enter a URL or search..."
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-foreground/20 bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-foreground/10 transition-colors"
                    >
                      <Icon icon="mdi:magnify" className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center">
                  Quick Links
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 justify-items-center">
                  {quickLinks.map((link) => (
                    <button
                      key={link.url}
                      onClick={() => handleQuickLink(link.url)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors w-full max-w-[200px]"
                    >
                      <Icon icon={link.icon} className="w-8 h-8" />
                      <span className="text-sm">{link.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <Icon
                    icon="mdi:information"
                    className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
                  />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                      Note about embedded browsing
                    </p>
                    <p className="text-foreground/70">
                      Some websites prevent being displayed in embedded browsers
                      for security reasons. <br></br> If you see an error message, try use
                      proxy mode.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : loadError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="max-w-md w-full space-y-6 text-center">
              <Icon
                icon="mdi:alert-circle"
                className="w-16 h-16 mx-auto text-red-500"
              />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Cannot Load Page</h2>
                <p className="text-foreground/70">
                  This website cannot be displayed in the embedded browser due
                  to security restrictions.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => window.open(url, "_blank")}
                  className="px-6 py-3 bg-primary hover:bg-secondary text-white hover:text-black rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:open-in-new" className="w-5 h-5" />
                  Open in New Tab
                </button>
                <button
                  onClick={() => {
                    setUseProxy(true);
                    setLoadError(false);
                    setIsLoading(true);
                    setUrl("");
                    setTimeout(() => setUrl(inputUrl), 10);
                  }}
                  className="px-6 py-3 bg-foreground/10 hover:bg-foreground/20 rounded-lg font-semibold"
                >
                  Try with Proxy
                </button>
                <button
                  onClick={handleHome}
                  className="px-6 py-3 bg-foreground/5 hover:bg-foreground/10 rounded-lg"
                >
                  Go Home
                </button>
              </div>
              <p className="text-sm text-foreground/50">
                Many sites block iframe embedding for security. The proxy can
                help with some sites, but may be slow or unavailable. Opening in
                a new tab is the most reliable option.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {isLoading && (
              <div className="flex items-center justify-center bg-background">
                <div className="h-1/2 w-1/2">
                  <SilhouetteBackground show={true} imgUrl={silhouetteTr} />
                </div>
              </div>
            )}
            {url && (
              <iframe
                key={url + (useProxy ? "-proxy" : "")}
                className="w-full h-full border-0"
                src={getFinalUrl(url)}
                onLoad={() => {
                  setIsLoading(false);
                  setLoadError(false);
                }}
                onError={() => {
                  setIsLoading(false);
                  setLoadError(true);
                }}
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-top-navigation"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

const Browser = () => {
  return (
    <BrowserProvider>
      <BrowserContent />
    </BrowserProvider>
  );
};

export const launcherBrowser: WindowLauncherProps = {
  title: "Browser",
  appId: "browser",
  content: <Browser />,
  size: {
    width: 1000,
    height: 700,
  },
  icon: "mdi:web",
  launcherRef: createRef(),
};
