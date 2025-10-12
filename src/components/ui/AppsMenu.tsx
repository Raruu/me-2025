import {
  TaskbarItemWindowLauncher,
  WindowLauncherProps,
} from "./Taskbar/TaskbarItem";
import React, { useContext, useEffect, useRef, useState } from "react";
import { mapMediaQuery, useMediaQuery } from "@/hooks/useMediaQuery";
import { getAllAppsList } from "@/constants/AppsList";
import { WindowManagerContext } from "@/providers/WindowManagerContext";

export const AppsMenu = () => {
  const {
    taskBarRef,
    appsMenuRef,
    windows,
    dispatch,
    borderConstrains,
    setIsAppsMenuOpen,
  } = useContext(WindowManagerContext);
  const mediaQuery = useMediaQuery();

  const [isAnimating, setIsAnimating] = useState(true);

  const [allAppsList, setAllAppsList] = useState<
    Array<Array<WindowLauncherProps>>
  >([]);
  const CHUNK_SIZE = 40;

  useEffect(() => {
    // const col: Array<Array<WindowLauncherProps>> = [];
    // for (let index = 0; index < 3; index++) {
    //   const row: Array<WindowLauncherProps> = [];
    //   for (let i = 0; i < 20; i++) {
    //     row.push(...AppsList());
    //   }
    //   col.push(row);
    // }
    // setAllAppsList(col);

    const appsList = getAllAppsList();
    const chunkedAppsList = Array.from(
      { length: Math.ceil(appsList.length / CHUNK_SIZE) },
      (_, i) => appsList.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    );
    setAllAppsList(chunkedAppsList);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAppsList, setSearchAppsList] = useState<
    Array<Array<WindowLauncherProps>>
  >([]);
  const displayAppsList: Array<Array<WindowLauncherProps>> = searchQuery
    ? searchAppsList
    : allAppsList;
  const totalPages = displayAppsList.length;

  useEffect(() => {
    const allItems = allAppsList.flat();
    const filteredItems = searchQuery
      ? allItems.filter((item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allItems;
    const chunkedItems = Array.from(
      { length: Math.ceil(filteredItems.length / CHUNK_SIZE) },
      (_, i) => filteredItems.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    );

    setSearchAppsList(chunkedItems);
  }, [allAppsList, searchQuery]);

  const isScrollingRef = useRef(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (isScrollingRef.current) return;

    if (e.deltaY > 0 || e.deltaX > 0) {
      if (currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
        isScrollingRef.current = true;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 350);
      }
    } else if (e.deltaY < 0 || e.deltaX < 0) {
      if (currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
        isScrollingRef.current = true;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 350);
      }
    }
  };

  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const draggingStart = useRef(0);
  const [draggingValue, setDraggingValue] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    draggingStart.current = e.touches[0].clientX;
    setIsTouchDragging(true);
  };

  useEffect(() => {
    setDraggingValue(currentPage * window.innerWidth * -1);
  }, [currentPage]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchDragging || displayAppsList.length === 1) return;
      setDraggingValue(
        currentPage * window.innerWidth * -1 +
          e.touches[0].clientX -
          draggingStart.current
      );
    };

    const handleTouchEnd = () => {
      // console.log(draggingValue);
      const threshold = currentPage * window.innerWidth * -1 + 20;
      if (draggingValue < -threshold && currentPage < totalPages - 1) {
        setCurrentPage((prev) => prev + 1);
      } else if (draggingValue > threshold && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
      setIsTouchDragging(false);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    currentPage,
    displayAppsList.length,
    draggingValue,
    isTouchDragging,
    totalPages,
  ]);

  useEffect(() => {
    setIsAnimating(false);
    appsMenuRef.current.close = () => setIsAnimating(true);
  }, [appsMenuRef]);

  return (
    <div
      ref={appsMenuRef}
      className="absolute top-0 left-0 w-full h-full
        bg-background-tr backdrop-blur transition-opacity duration-300"
      style={{
        paddingTop: `${borderConstrains.top}px`,
        opacity: isAnimating ? 0 : 1,
      }}
      onTransitionEnd={() => {
        if (isAnimating) {
          setIsAppsMenuOpen(false);
        }
      }}
    >
      <div
        className="flex flex-col h-full overflow-hidden transition-transform duration-300"
        style={{
          paddingLeft: `${taskBarRef.current.left ?? 0}px`,
          paddingRight: `${taskBarRef.current.right ?? 0}px`,
          paddingBottom: `${taskBarRef.current.bottom ?? 0}px`,
          transform: isAnimating
            ? taskBarRef.current.taskbarPlacement === "bottom"
              ? "translateY(100%)"
              : taskBarRef.current.taskbarPlacement === "left"
              ? "translateX(-100%)"
              : "translateX(100%)"
            : "translateY(0)",
        }}
      >
        <div className="flex h-1/6 w-full justify-center items-end md:items-center lg:items-end">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className="bg-background appearance-none rounded-3xl w-9/12 sm:w-1/2 lg:w-1/3 xl:w-1/4 h-10
                        py-2 px-4 text-foreground leading-tight border-2 border-background shadow-sm
                        focus:outline-none focus:bg-background focus:border-primary"
          />
        </div>

        <div
          className="flex transition-transform duration-300 h-full touch-none"
          style={{
            transform: isTouchDragging
              ? `translateX(${draggingValue}px)`
              : `translateX(calc(-${currentPage * 100}vw - ${
                  taskBarRef.current.left ?? 0
                }px - ${taskBarRef.current.right ?? 0}px ))`,
            transitionDuration: isTouchDragging ? "100ms" : "",
            transitionTimingFunction: isTouchDragging ? "linear" : "",
            width: `${totalPages * 100}vw`,
          }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
        >
          {displayAppsList.map((page, pageIndex) => (
            <div
              key={pageIndex}
              className="flex justify-center items-center flex-shrink-0 w-screen px-4"
            >
              <div
                className="grid gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-4
                           grid-cols-5 md:grid-cols-8 xl:grid-cols-10"
              >
                {page.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      minHeight: mapMediaQuery(mediaQuery, {
                        default: "60px",
                        sm: "70px",
                        md: "120px",
                      }),
                    }}                  
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAnimating(true);
                    }}
                    // onTouchStart={handleTouchStart}
                  >
                    <TaskbarItemWindowLauncher
                      taskBarRef={taskBarRef}
                      windows={windows}
                      windowLauncherProps={item}
                      dispatch={dispatch}
                      isShowTitle
                      size={parseInt(
                        mapMediaQuery(mediaQuery, {
                          default: "40",
                          sm: "50",
                          lg: "80",
                          xl: "90",
                        }),
                        10
                      )}
                    />
                  </div>
                ))}
                {Array.from({ length: CHUNK_SIZE - page.length }).map(
                  (_, i) => {
                    return (
                      <div
                        key={i}
                        className="h-full w-full"
                        style={{
                          minHeight: mapMediaQuery(mediaQuery, {
                            default: "60px",
                            sm: "90px",
                            md: "120px",
                          }),
                        }}
                      ></div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center gap-2 pb-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-3 h-3 rounded-full ${
                i === currentPage
                  ? "bg-primary"
                  : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
