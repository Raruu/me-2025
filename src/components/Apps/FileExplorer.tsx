import {
  createContext,
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WindowLauncherProps } from "../ui/Taskbar/TaskbarItem";
import {
  UILocationItem,
  UILocationItemSeparator,
} from "../ui/components/UILocationItem";
import { Icon } from "@iconify/react/dist/iconify.js";
import { db, FileSystemDB } from "@/lib/db";
import { WindowContext } from "../Window/Window";
import { DropDown, DropDownRef } from "../Dropdown/Dropdown";
import { DropDownItem } from "../Dropdown/DropdownItem";

const NavigationButton = ({
  icon,
  disabled,
  onClick,
}: {
  icon: string;
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <Icon
      icon={icon}
      className={`text-2xl transition-colors duration-150 rounded-md p-1 ${
        disabled
          ? "opacity-50"
          : "hover:bg-secondary hover:text-background cursor-pointer"
      }`}
      onClick={disabled ? undefined : onClick}
    />
  );
};

const ExplorerItem = ({
  type,
  title,
  icon,
  onDoubleClick,
}: {
  type: "FOLDER" | "FILE";
  title: string;
  icon?: string;
  isSelected?: boolean;
  onDoubleClick?: () => void;
}) => {
  return (
    <div
      className="flex flex-col items-center py-1 h-fit max-h-20 w-20 transition-colors duration-150
      hover:bg-secondary rounded-md cursor-pointer dark:hover:text-background"
      onDoubleClick={onDoubleClick}
    >
      <Icon
        icon={
          icon
            ? icon
            : type === "FOLDER"
            ? "iconamoon:folder"
            : "iconamoon:file-document"
        }
        className="text-4xl min-h-9 max-h-9"
      />
      <span className="text-xs w-11/12 overflow-hidden break-words text-center">
        {title}
      </span>
    </div>
  );
};

type TypeExplorerViewItems = Array<
  FileSystemDB["files"]["value"] | FileSystemDB["folders"]["value"]
>;

const ExplorerView = ({
  explorerViewItems,
  openLocation,
}: {
  explorerViewItems: TypeExplorerViewItems;
  openLocation: (location: string) => void;
}) => {
  const contextPosMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<DropDownRef>({
    handleOpen: () => {},
    close: () => {},
  });
  const windowPos = useContext(WindowContext).position;
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (contextPosMenuRef.current && !isContextMenuOpen) {
        const posX = event.clientX - windowPos.x + 10;
        const posY = event.clientY - windowPos.y - 50;
        contextPosMenuRef.current.style.transform = `translate(${posX}px, ${posY}px)`;
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [contextPosMenuRef, isContextMenuOpen, windowPos]);

  return (
    <div
      className="w-full h-full"
      onContextMenu={(e) => {
        e.preventDefault();
        contextMenuRef.current?.handleOpen();
      }}
    >
      <div
        className="d-none absolute w-full h-full left-0 top-0"
        style={{
          display: isContextMenuOpen ? "block" : "",
          pointerEvents: isContextMenuOpen ? "all" : "none",
        }}
        onClick={() => {
          if (contextMenuRef.current && "close" in contextMenuRef.current) {
            contextMenuRef.current.close();
          }
        }}
      ></div>
      <div ref={contextPosMenuRef} className="absolute top-0 left-0">
        <DropDown
          ref={contextMenuRef}
          calcPosition={false}
          callback={(val) => setIsContextMenuOpen(val)}
        >
          <DropDownItem
            text="New Folder"
            iconifyString="mynaui:plus-solid"
            disabled={true}
          />
        </DropDown>
      </div>
      {explorerViewItems.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-2 w-full h-fit overflow-auto">
          {explorerViewItems.map((item) => {
            const isFile = "blob" in item;
            return (
              <ExplorerItem
                key={item.id}
                type={isFile ? "FILE" : "FOLDER"}
                title={item.name}
                onDoubleClick={isFile ? () => {} : () => openLocation(item.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Icon icon="solar:folder-open-line-duotone" className="text-6xl" />
          <span className="text-2xl">No items found</span>
        </div>
      )}
    </div>
  );
};

const FileExplorer = () => {
  const fileExplorerContext = createContext<{
    directoryPath: string;
  }>({
    directoryPath: "",
  });

  const [explorerViewItems, setExplorerViewItems] =
    useState<TypeExplorerViewItems>([]);

  const [directoryPath, setDirectoryPath] = useState<string>("");
  const [parentId, setParentId] = useState<string>("");
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const openLocation = async (location: string, updateHistory = true) => {
    setExplorerViewItems(await db.loadChildren(location));

    let path = "";
    let currentLocation = await db.loadFolder(location);
    setParentId(currentLocation?.parentId ?? "");

    if (updateHistory) {
      setStepHistory((prev) => {
        if (prev[prev.length - 1] === location) return prev;
        const newHistory = [...prev.slice(0, currentStep + 1), location];
        setCurrentStep(newHistory.length - 1);
        return newHistory;
      });
    }

    while (currentLocation?.parentId !== undefined) {
      path = currentLocation.name + "/" + path;
      currentLocation = await db.loadFolder(currentLocation.parentId);
    }
    if (path[0] !== "/") path = "/" + path;
    setDirectoryPath(path);
  };

  return (
    <div className="bg-background w-full h-full flex flex-col select-none overflow-hidden">
      <div className="flex flex-row w-full py-2 items-center px-4 bg-background-tr gap-4">
        <div className="flex flex-row items-center gap-4">
          <NavigationButton
            icon="ep:arrow-left-bold"
            onClick={() => {
              if (currentStep > 0) {
                openLocation(stepHistory[currentStep - 1], false);
                setCurrentStep(currentStep - 1);
              }
            }}
            disabled={currentStep === 0}
          />
          <NavigationButton
            icon="ep:arrow-right-bold"
            onClick={() => {
              if (currentStep < stepHistory.length - 1) {
                openLocation(stepHistory[currentStep + 1], false);
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={currentStep === stepHistory.length - 1}
          />
          <NavigationButton
            icon="ep:arrow-up-bold"
            onClick={() => openLocation(parentId)}
            disabled={parentId === ""}
          />
        </div>
        <input
          className="w-full h-8 px-2 border border-primary rounded-md outline-none bg-background"
          type="text"
          placeholder="Directory"
          value={directoryPath}
          readOnly
          // onChange={(e) => setDirectoryPath(e.target.value)}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter") {
          //     openLocation(directoryPath, true);
          //   }
          // }}
        />
      </div>
      <div className="w-full h-full flex flex-row">
        <div className="flex flex-col min-w-48 px-1 bg-background-tr gap-1">
          <UILocationItem
            title="Home"
            icon="iconamoon:home"
            iconIfSelected="iconamoon:home-fill"
            onClick={() => openLocation("home")}
          />
          {/* <UILocationItem
          title="Documents"
          icon="iconamoon:file-document"
          iconIfSelected="iconamoon:file-document-fill"
        />
        <UILocationItem title="Pictures" icon="heroicons:photo-16-solid" /> */}
          <UILocationItemSeparator />
          <UILocationItem
            title=""
            icon="heroicons:slash-16-solid"
            onClick={() => openLocation("root")}
          />
        </div>
        <fileExplorerContext.Provider value={{ directoryPath }}>
          <ExplorerView
            explorerViewItems={explorerViewItems}
            openLocation={openLocation}
          />
        </fileExplorerContext.Provider>
      </div>
    </div>
  );
};

export const launcherFileExplorer: WindowLauncherProps = {
  title: `File Explorer`,
  appId: "fileexplorer",
  icon: "bxs:cabinet",
  content: <FileExplorer />,
  size: {
    width: 800,
    height: 550,
  },
  minSize: {
    width: 400,
    height: 0,
  },
  launcherRef: createRef(),
};
