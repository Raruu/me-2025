import { useContext, useEffect, useRef, useState } from "react";
import { SettingNavItemProps } from "..";
import { EtcContext } from "@/lib/Etc/Etc";
import Image from "next/image";
import { WindowContext } from "@/components/Window";
import { useElementSize } from "@/hooks/useElementSize";
import { mapMediaQuery } from "@/hooks/useMediaQuery";
import { ButtonNetral } from "@/components/ButtonNetral";
import { imageNames } from "@/lib/Etc/EtcTheme";
import { db } from "@/lib/db";
import { SettingGroup } from "../SettingGroup";
import { SettingBool } from "../SettingBool";
import { SettingTextField } from "../SettingTextField";

const ModalWallpaper = ({
  title,
  bgUrl,
  onConfirm,
  onCancel,
  onReset,
}: {
  title: string;
  bgUrl: string;
  onConfirm?: (value: File | null) => void;
  onCancel?: () => void;
  onReset?: () => void;
}) => {
  const [value, setValue] = useState(bgUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { mediaQuery, elementRef } = useElementSize();
  const windowRef = useContext(WindowContext).windowRef;
  elementRef.current = windowRef.current;

  useEffect(() => {
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setValue(objectURL);
    }
  }, [file]);

  return (
    <div className="overflow-hidden absolute w-full h-full select-none">
      <div className="w-full h-full bg-secondary opacity-50 absolute"></div>
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="flex flex-col bg-background rounded-lg p-4 pt-3 gap-4">
          <h1 className="text-base font-bold tracking-tight">{title}</h1>
          <div className="flex flex-col justify-center items-center gap-4">
            <div
              className="flex items-center justify-center relative"
              style={{
                width: mapMediaQuery(mediaQuery, {
                  default: "300px",
                  sm: "400px",
                  md: "500px",
                  lg: "600px",
                }),
                height: mapMediaQuery(mediaQuery, {
                  default: "75px",
                  sm: "175px",
                  md: "275px",
                  lg: "375px",
                }),
              }}
            >
              <Image
                src={value}
                alt="Wallpaper"
                style={{ objectFit: "contain" }}
                fill
              />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <ButtonNetral
              text="Change Image"
              onClick={() => fileInputRef.current?.click()}
            />
          </div>

          <div className="flex flex-row justify-between gap-2">
            <button
              onClick={() => onReset?.()}
              className="flex items-center justify-center bg-red-400 hover:bg-tertiary 
              dark:hover:text-background w-16 h-10 rounded-xl transition-colors"
            >
              Reset
            </button>
            <div className="flex flex-row justify-end gap-2">
              <ButtonNetral text="Cancel" onClick={onCancel} />
              <button
                onClick={() => onConfirm?.(file)}
                className="flex items-center justify-center bg-primary hover:bg-tertiary 
              dark:hover:text-background w-16 h-10 rounded-xl transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Wallpaper = ({
  name,
  title,
  bgUrl,
  isVertical,
}: {
  name: string;
  title: string;
  bgUrl: string;
  isVertical?: boolean;
}) => {
  const setModal = useContext(WindowContext).setModal;
  const applyBg = useContext(EtcContext).themeSettings.applyBg;

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`border border-secondary dark:border-gray-500 rounded-lg 
        cursor-pointer transition-colors ${
          isVertical ? "min-w-24 h-40" : "min-w-40 h-24"
        }`}
      >
        <div
          className="w-full h-full rounded relative bg-secondary overflow-clip"
          onClick={() => {
            setModal(
              <ModalWallpaper
                title={title}
                bgUrl={bgUrl}
                onCancel={() => setModal(undefined)}
                onReset={async () => {
                  await db.deleteFile(name);
                  setModal(undefined);
                  applyBg(name, null);
                }}
                onConfirm={(value) => {
                  setModal(undefined);
                  if (value) {
                    applyBg(name, value);
                  }
                }}
              ></ModalWallpaper>
            );
          }}
        >
          <Image
            src={bgUrl}
            alt="Wallpaper"
            fill
            style={{ objectFit: "cover" }}
          />
          <div className="absolute bg-secondary w-full h-full opacity-0 hover:opacity-35 transition-opacity"></div>
        </div>
      </div>
      <h5>{title}</h5>
    </div>
  );
};

const SettingThemeContent = () => {
  const setModal = useContext(WindowContext).setModal;
  useEffect(() => {
    return () => setModal(undefined);
  }, [setModal]);

  const {
    theme,
    setTheme,
    bgHzUrlLight,
    bgHzUrlDark,
    bgVerUrlLight,
    bgVerUrlDark,
    silhouetteTr,
    applySilhouette,
    silhouetteDuration,
    setSilhouetteDuration,
  } = useContext(EtcContext).themeSettings;

  return (
    <div>
      <SettingGroup title="Wallpaper" hideBackground>
        <div className="flex flex-wrap justify-center gap-4">
          <Wallpaper
            title="Horizontal Light"
            bgUrl={bgHzUrlLight}
            name={imageNames.bgHzLightImage}
          />
          <Wallpaper
            title="Horizontal Dark"
            bgUrl={bgHzUrlDark}
            name={imageNames.bgHzDarkImage}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Wallpaper
            title="Vertical Light"
            bgUrl={bgVerUrlLight}
            isVertical
            name={imageNames.bgVerLightImage}
          />
          <Wallpaper
            title="Vertical Dark"
            bgUrl={bgVerUrlDark}
            isVertical
            name={imageNames.bgVerDarkImage}
          />
        </div>
      </SettingGroup>
      <SettingGroup title="Silhouette Transition">
        <div className="relative w-full h-48">
          <Image
            src={silhouetteTr}
            alt="Silhouette Transition"
            style={{ objectFit: "contain" }}
            fill
          />
          <div
            className="w-full h-full bg-secondary opacity-0 hover:opacity-50 absolute rounded-xl transition-opacity"
            onClick={() => {
              setModal(
                <ModalWallpaper
                  title="Silhouette Image"
                  bgUrl={silhouetteTr}
                  onCancel={() => setModal(undefined)}
                  onReset={async () => {
                    await db.deleteFile(imageNames.silhouetteTr);
                    setModal(undefined);
                    applySilhouette(null);
                  }}
                  onConfirm={(value) => {
                    setModal(undefined);
                    if (value) {
                      applySilhouette(value);
                    }
                  }}
                ></ModalWallpaper>
              );
            }}
          ></div>
        </div>
        <SettingTextField
          title="Duration"
          subtitle="in ms"
          value={silhouetteDuration.toString()}
          onChange={(value) => {
            if (isNaN(parseInt(value))) return;
            setSilhouetteDuration(parseInt(value));
          }}
        />
      </SettingGroup>
      <SettingGroup title="Theme Setting">
        <SettingBool
          title="Dark Mode"
          value={theme.includes("dark")}
          setValue={(value) => {
            if (theme.includes("tr-")) return;
            setTheme(value ? "tr-dark" : "tr-light");
          }}
        />
      </SettingGroup>
    </div>
  );
};

export const settingItemTheme: SettingNavItemProps = {
  title: "Theme",
  icon: "line-md:paint-drop-twotone",
  content: <SettingThemeContent />,
};
