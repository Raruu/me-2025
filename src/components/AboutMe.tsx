import NextImage from "next/image";
import { TextRotate } from "./TextRotate";

export const AboutMe = () => {
  return (
    <div className="flex flex-row items-center justify-center bg-background w-full h-full">
      <div className="flex flex-col items-center w-48">
        <NextImage
          src={"/me-azusa.webp"}
          style={{ width: "100%", height: "auto" }}
          alt="Picture of me"
          width={200}
          height={200}
        />
        <div className="h-4" />
        <TextRotate
          textPrefix="Hi, I'm"
          texts={["Widi", "Raruu", "ᓀ‸ᓂ"]}
          animFrom="end"
          displayDuration={500}
        />
        <div className="h-2"></div>
        <h1 className="text-sm font-bold">I code, Student</h1>
        <div className="h-2"></div>
        <h1 className="text-xs italic">Build this website brick by brick</h1>
      </div>
    </div>
  );
};
