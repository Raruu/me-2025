import { useElementSize } from "@/hooks/useElementSize";
import { MediaQuery } from "@/hooks/useMediaQuery";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  RefObject,
  useEffect,
} from "react";

const START_PAGE = "about:blank";

interface BrowserContextType {
  url: string;
  setUrl: (url: string) => void;
  inputUrl: string;
  setInputUrl: (url: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  canGoBack: boolean;
  setCanGoBack: (can: boolean) => void;
  canGoForward: boolean;
  setCanGoForward: (can: boolean) => void;
  history: string[];
  setHistory: (history: string[]) => void;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  showStartPage: boolean;
  setShowStartPage: (show: boolean) => void;
  loadError: boolean;
  setLoadError: (error: boolean) => void;
  useProxy: boolean;
  setUseProxy: (use: boolean) => void;
  handleNavigate: (e: React.FormEvent) => void;
  handleGoBack: () => void;
  handleGoForward: () => void;
  handleRefresh: () => void;
  handleHome: () => void;
  handleQuickLink: (linkUrl: string) => void;
  getFinalUrl: (originalUrl: string) => string;
  START_PAGE: string;
  mediaQuery: MediaQuery;
  elementRef: RefObject<HTMLDivElement | null>;
  toolbarInside: boolean;
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error("useBrowser must be used within BrowserProvider");
  }
  return context;
};

export const BrowserProvider = ({ children }: { children: ReactNode }) => {
  const [url, setUrl] = useState(START_PAGE);
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [history, setHistory] = useState<string[]>([START_PAGE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showStartPage, setShowStartPage] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [useProxy, setUseProxy] = useState(true);
  const { mediaQuery, elementRef } = useElementSize();
  const [toolbarInside, setToolbarInside] = useState(false);

  useEffect(() => {
    const shouldBeInside = mediaQuery === "default" || mediaQuery === "sm";
    setToolbarInside(shouldBeInside);
  }, [mediaQuery]);

  const handleQuickLink = (linkUrl: string) => {
    setShowStartPage(false);
    setLoadError(false);
    setUrl(linkUrl);
    setInputUrl(linkUrl);
    setIsLoading(true);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(linkUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCanGoBack(newHistory.length > 1);
    setCanGoForward(false);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadError(false);
    let newUrl = inputUrl.trim();

    if (!newUrl) return;

    if (!newUrl.includes(".") && !newUrl.startsWith("http")) {
      newUrl = `https://onionsearchengine.com/search.php?q=${encodeURIComponent(newUrl)}`;
    } else if (
      !newUrl.startsWith("http://") &&
      !newUrl.startsWith("https://")
    ) {
      newUrl = `https://${newUrl}`;
    }

    setShowStartPage(false);
    setLoadError(false);
    setUrl(newUrl);
    setInputUrl(newUrl);
    setIsLoading(true);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCanGoBack(newHistory.length > 1);
    setCanGoForward(false);
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const newUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setShowStartPage(newUrl === START_PAGE);
      setLoadError(false);
      setUrl(newUrl);
      setInputUrl(newUrl === START_PAGE ? "" : newUrl);
      setIsLoading(newUrl !== START_PAGE);
      setCanGoBack(newIndex > 0);
      setCanGoForward(true);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const newUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setShowStartPage(newUrl === START_PAGE);
      setLoadError(false);
      setUrl(newUrl);
      setInputUrl(newUrl === START_PAGE ? "" : newUrl);
      setIsLoading(newUrl !== START_PAGE);
      setCanGoBack(true);
      setCanGoForward(newIndex < history.length - 1);
    }
  };

  const handleRefresh = () => {
    if (showStartPage) return;
    setLoadError(false);
    setIsLoading(true);
    setUrl("");
    setTimeout(() => setUrl(inputUrl), 10);
  };

  const handleHome = () => {
    setShowStartPage(true);
    setUrl(START_PAGE);
    setInputUrl("");
    setIsLoading(false);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(START_PAGE);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCanGoBack(newHistory.length > 1);
    setCanGoForward(false);
  };

  const getFinalUrl = (originalUrl: string) => {
    if (!useProxy || originalUrl === START_PAGE) return originalUrl;
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(
      originalUrl
    )}`;
  };

  const value = {
    url,
    setUrl,
    inputUrl,
    setInputUrl,
    isLoading,
    setIsLoading,
    canGoBack,
    setCanGoBack,
    canGoForward,
    setCanGoForward,
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
    showStartPage,
    setShowStartPage,
    loadError,
    setLoadError,
    useProxy,
    setUseProxy,
    handleNavigate,
    handleGoBack,
    handleGoForward,
    handleRefresh,
    handleHome,
    handleQuickLink,
    getFinalUrl,
    START_PAGE,
    mediaQuery,
    elementRef,
    toolbarInside,
  };

  return (
    <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>
  );
};
