import { useContext } from "react";
import { SettingBool, SettingGroup, SettingNavItemProps } from "../Setting";
import { EtcContext } from "@/lib/Etc";

const SettingThemeContent = () => {
  const { theme, setTheme } = useContext(EtcContext).themeSettings;

  return (
    <div>
      <SettingGroup title="Theme Setting">
        <SettingBool
          title="Dark Mode"
          value={theme.includes("dark")}
          setValue={(value) => {
            if(theme.includes("tr-")) return;
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
