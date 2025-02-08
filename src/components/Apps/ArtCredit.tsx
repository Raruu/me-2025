import { useElementSize } from "@/hooks/useElementSize";
import { TextRotate } from "../TextRotate";
import { mapMediaQuery, MediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import NextImage from "next/image";
import { artCredits } from "@/configs/ArtCredits";
import { Icon } from "@iconify/react";

const HastagSection = ({
  mediaQuery,
  animSeq,
  height,
}: {
  mediaQuery: MediaQuery;
  animSeq: number;
  height: number;
}) => {
  const postingAzusa = [
    "無言でアズサを貼るとフォロワーさんが増える",
    "Posting Azusa without saying anything will increase your followers",
  ];

  const [isPostingAzusaSubtitle, setIsPostingAzusaSubtitle] = useState(true);

  const hashtags = [
    [
      { link: "https://x.com/hashtag/BlueArchive", text: "#BlueArchive" },
      {
        link: "https://x.com/hashtag/%E3%83%96%E3%83%AB%E3%82%A2%E3%82%AB",
        text: "#ブルアカ",
      },
    ],
    [
      {
        link: "https://x.com/hashtag/%E3%83%96%E3%83%AB%E3%83%BC%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96%E4%B8%80",
        text: "#ブルーアーカイブ一",
      },
      {
        link: "https://x.com/hashtag/%E7%99%BD%E6%B4%B2%E3%82%A2%E3%82%BA%E3%82%B5",
        text: "#白洲アズサ",
      },
    ],
  ];

  useEffect(() => {
    if (animSeq === 1) {
      setTimeout(() => {
        setIsPostingAzusaSubtitle(false);
      }, 500);
    }
  }, [animSeq]);

  return (
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full transition-all duration-700
        flex flex-col items-center justify-center bg-background gap-1 overflow-hidden pb-3"
      style={{
        height: animSeq < 1 ? "100%" : `${height}px`,
      }}
    >
      <div className="flex flex-col items-center">
        <a
          href="https://x.com/hashtag/%E7%84%A1%E8%A8%80%E3%81%A7%E3%82%A2%E3%82%BA%E3%82%B5%E3%82%92%E8%B2%BC%E3%82%8B%E3%81%A8%E3%83%95%E3%82%A9%E3%83%AD%E3%83%AF%E3%83%BC%E3%81%95%E3%82%93%E3%81%8C%E5%A2%97%E3%81%88%E3%82%8B"
          target="_blank"
          rel="noreferrer"
        >
          <TextRotate
            prefix="#"
            texts={postingAzusa}
            spacing={
              animSeq < 1
                ? -10
                : parseInt(
                    mapMediaQuery(mediaQuery, { default: "-12", md: "-16" })
                  )
            }
            rotateTextColor="var(--foreground)"
            rotateBgColor="transparent"
            textSize={
              animSeq < 1
                ? 20
                : parseInt(
                    mapMediaQuery(mediaQuery, { default: "12", md: "16" })
                  )
            }
            textLineHeight={parseInt(
              mapMediaQuery(mediaQuery, { default: "1" })
            )}
            mediaQuery={mediaQuery}
            skip={animSeq === 1}
          />
        </a>
        {isPostingAzusaSubtitle && (
          <p
            className="top-0 text-xs italic transition-all duration-300"
            style={{
              opacity: animSeq < 1 ? 1 : 0,
              marginTop: animSeq < 1 ? "0" : "-20px",
            }}
          >
            {postingAzusa[1]}
          </p>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center justify-center flex-wrap">
        {hashtags.map((tags, index) => (
          <div key={index} className="flex flex-row gap-2">
            {tags.map((tag) => (
              <a
                key={tag.text}
                href={tag.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs italic underline hover:text-tertiary transition-opacity duration-700"
                style={{
                  opacity: animSeq < 1 ? 0 : 1,
                  marginTop: animSeq < 1 ? "-16px" : "",
                }}
              >
                {tag.text}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ArtCredit = () => {
  const { mediaQuery, elementRef } = useElementSize();
  const [animSequence, setAnimSequence] = useState(0);
  const hashtagSectionHeight = 48;

  useEffect(() => {
    let intervalId: number | undefined;
    if (animSequence < 3) {
      intervalId = window.setInterval(() => {
        setAnimSequence((prev) => prev + 1);
      }, 2000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [animSequence]);

  return (
    <div
      ref={elementRef}
      className="flex flex-col items-center bg-background 
        w-full h-full gap-4 relative overflow-hidden pt-2"
      style={{ paddingBottom: hashtagSectionHeight + 10 }}
    >
      <div
        className="flex flex-col items-center w-full overflow-auto gap-6"
        style={{ scrollbarWidth: "none" }}
      >
        {artCredits.map((artist) => (
          <div key={artist.artistName} className="w-full px-2 ">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-lg font-bold tracking-wide px-4">
                {artist.artistName}
              </h1>
              <div className="flex items-center gap-4">
                {artist.socialMedia.x && (
                  <div
                    style={{ backgroundColor: "#000000" }}
                    className="rounded-xl select-none"
                  >
                    <a
                      href={artist.socialMedia.x}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TextRotate
                        prefix={
                          <Icon
                            className="inline-flex w-full min-w-5 min-h-5"
                            style={{
                              marginLeft: "8px",
                              marginTop: "-6px",
                              color: "white",
                            }}
                            icon={"ri:twitter-x-line"}
                          />
                        }
                        texts={
                          artist.socialMediaComents?.x
                            ? [...artist.socialMediaComents.x, "Or Twitter"]
                            : []
                        }
                        mediaQuery={mediaQuery}
                        rotateBgColor="transparent"
                        rotateTextColor="white"
                        nextDelay={5000}
                        animFrom="end"
                      />
                    </a>
                  </div>
                )}
                {artist.socialMedia.pixiv && (
                  <div
                    style={{ backgroundColor: "#0096fa" }}
                    className="rounded-xl select-none"
                  >
                    <a
                      href={artist.socialMedia.pixiv}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TextRotate
                        prefix={
                          <Icon
                            className="inline-flex w-full min-w-5 min-h-5"
                            style={{
                              marginLeft: "8px",
                              marginTop: "-6px",
                              color: "var(--background)",
                            }}
                            icon={"simple-icons:pixiv"}
                          />
                        }
                        texts={
                          artist.socialMediaComents?.pixiv
                            ? [...artist.socialMediaComents.pixiv, "Pixiv"]
                            : []
                        }
                        mediaQuery={mediaQuery}
                        rotateBgColor="transparent"
                        nextDelay={5000}
                        animFrom="end"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="h-1" />
            <div className="w-full h-[2px] bg-foreground rounded-md" />
            <div className="flex flex-row gap-2 overflow-auto px-6 py-2">
              {artist.arts?.map((art) => (
                <a
                  key={art.imgAssetPath}
                  href={art.linkWhereIFoundThisArt}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center overflow-y-auto max-w-56"
                  style={{
                    cursor: art.linkWhereIFoundThisArt ? "" : "not-allowed",
                  }}
                >
                  <NextImage
                    src={art.imgAssetPath}
                    alt={`Art credit for ${artist.artistName}`}
                    className="w-auto h-24"
                    width={200}
                    height={200}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <HastagSection
        mediaQuery={mediaQuery}
        animSeq={animSequence < 2 ? animSequence : 2}
        height={hashtagSectionHeight}
      />
    </div>
  );
};
