"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { WavyBackground } from "@/components/ui/wavy-background";
import Link from "next/link";
import ImageSlider from "@/components/ImageSlider";
import Video from "next-video";
import homepage from "@/videos/homepage.mp4";

interface LanderProps {
  ref?: React.RefObject<HTMLDivElement>;
  title_data: {
    title: string;
    title2?: string;
    des?: string;
  }[];
  flip?: boolean;
  video?: boolean;
  buttonTxt?: string;
  buttonLink?: string;
  button?: boolean;
  currency?: boolean;
  images:
    | Array<{
        image: string;
        position: string;
      }>
    | [];
}

export default function Lander({
  title_data,
  images,
  ref,
  buttonTxt = "Become a member",
  buttonLink = "/membership",
  button = true,
  video = false,
  flip = false,
  currency: showCurrency = false,
}: LanderProps) {
  const [tick, setTick] = useState(0);

  const allDescriptions = title_data
    .map((t) => t.des)
    .filter((d): d is string => !!d);
  const allTitle2s = title_data
    .map((t) => t.title2)
    .filter((t): t is string => !!t);

  const currentTitle = title_data.length <= 1 ? 0 : tick % title_data.length;
  const currentDes =
    allDescriptions.length === 0
      ? undefined
      : allDescriptions.length === 1
        ? allDescriptions[0]
        : allDescriptions[tick % allDescriptions.length];
  const currentTitle2 =
    allTitle2s.length === 0
      ? undefined
      : allTitle2s.length === 1
        ? allTitle2s[0]
        : allTitle2s[tick % allTitle2s.length];

  const shouldAnimateDes = allDescriptions.length > 1;
  const shouldAnimateTitle2 = allTitle2s.length > 1;

  const [currencyData, setCurrencyData] = useState<{ GBP: number; INR: number }>({
    GBP: 0.0,
    INR: 0.0,
  });

  useEffect(() => {
    if (title_data.length <= 1 && allDescriptions.length <= 1 && allTitle2s.length <= 1) return;
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [title_data, allDescriptions.length, allTitle2s.length]);

  useEffect(() => {
    if (!showCurrency) return;
    axios
      .get("/api/currency")
      .then((res) => {
        setCurrencyData({
          GBP: res.data.fx.GBP,
          INR: res.data.fx.INR,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [showCurrency]);

  const handleButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonLink) return;
    if (buttonLink.startsWith("#")) {
      e.preventDefault();
      const id = buttonLink.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (buttonLink.includes("#")) {
      const [path, hash] = buttonLink.split("#");
      if (hash && typeof window !== "undefined" && window.location.pathname === path) {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    /*
     * FIX 1 — Consistent full-screen height.
     * Original used md:h-screen h-[70vh] which caused different heights on different devices.
     * h-screen everywhere + min-h-[500px] as safety floor.
     */
    <div
      className={`max-w-screen overflow-hidden w-full h-screen min-h-[500px] flex flex-col lg:flex-row ${
        flip ? "lg:flex-row-reverse" : "lg:flex-row"
      } justify-center bg-white`}
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
    >
      {/* ── Left panel: text + wavy background ── */}
      <div className="w-full lg:w-1/2 relative h-full">
        <WavyBackground
          backgroundFill="white"
          colors={["#f15c23", "#012d6b", "#d8c4b5"]}
          className={`absolute inset-0 flex flex-col ${
            flip ? "items-center" : "items-start"
          } justify-start z-10`}
        >
          {/*
           * FIX 2 — Navbar clearance + layout.
           * The navbar is fixed (~64px tall). Previously used mt-10/xl:mt-0 which:
           *   - was inconsistent across breakpoints
           *   - combined badly with justify-center on the parent, double-pushing content
           * Solution: parent WavyBackground uses justify-start, and this div uses
           * pt-16 (64px) to clear the navbar, then pb-6 for bottom breathing room.
           * justify-center is removed from parent to prevent double-offset.
           */}
          <div
            className={`w-full pt-24 pb-6 flex flex-col justify-center pl-6 md:pl-10 lg:ml-5 gap-4 md:gap-5 lg:gap-6 h-full ${
              flip ? "lg:w-[80%]" : "lg:w-[90%]"
            }`}
          >
            <AnimatePresence mode="wait">
              {/*
               * FIX 3 — Title container layout.
               * Non-flip: was "absolute inset-0" which caused text to overflow/clip at tablet
               * widths. Changed to normal flow with min-h reserves so layout doesn't jump
               * during text rotation animations.
               * Flip: stays h-fit (no rotation animation needed).
               */}
              <div
                key={"title"}
                className={`${
                  flip
                    ? "relative h-fit"
                    : "relative min-h-[60px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[190px]"
                } flex justify-left items-start`}
              >
                {flip ? (
                  <motion.div
                    key={currentTitle}
                    className="flex flex-row gap-2 lg:w-full w-[70%]"
                  >
                    <h1 className="text-navy text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black leading-tight md:leading-10 xl:leading-12 2xl:leading-16 tracking-tight justify-center items-center flex">
                      <motion.p
                        key={currentTitle}
                        className="flex flex-wrap gap-x-2 md:gap-x-3"
                      >
                        {title_data[currentTitle].title
                          .split(" ")
                          .map((word, index) => (
                            <motion.span
                              key={word + index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 * index }}
                              className="inline-block"
                            >
                              {word}{" "}
                            </motion.span>
                          ))}
                      </motion.p>
                    </h1>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentTitle}
                    className="flex flex-row gap-2 w-full"
                  >
                    <h1 className="text-navy text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-[3rem] font-black leading-tight md:leading-10 xl:leading-10 2xl:leading-12 tracking-tight justify-center items-center flex">
                      <motion.p
                        key={currentTitle}
                        className="flex flex-wrap gap-x-2 md:gap-x-3"
                      >
                        {title_data[currentTitle].title
                          .split(" ")
                          .map((word, index) => (
                            <motion.span
                              key={word + index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 * index }}
                              className={`inline-block ${index === 0 ? "text-tiger" : ""}`}
                            >
                              {word}{" "}
                            </motion.span>
                          ))}
                      </motion.p>
                    </h1>
                  </motion.div>
                )}
              </div>

              {currentTitle2 && (
                <div
                  key={"title2"}
                  className={`${
                    flip
                      ? "relative w-full h-fit"
                      : "relative w-full min-h-[30px] sm:min-h-[40px] md:min-h-[50px]"
                  } flex items-start`}
                >
                  <motion.p
                    key={shouldAnimateTitle2 ? `title2-${tick}` : "title2-static"}
                    initial={shouldAnimateTitle2 ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldAnimateTitle2 ? { opacity: 0, y: -20 } : undefined}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-navy/90 text-base md:text-xl font-bold w-[90%] flex flex-wrap gap-x-1 leading-[1.3] sm:leading-[1.4]"
                  >
                    {currentTitle2
                      .split(" ")
                      .map((word, index) => (
                        <motion.span
                          key={(word + index).toString()}
                          initial={shouldAnimateTitle2 ? { opacity: 0, y: 20 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          className="inline-block"
                        >
                          {word}{" "}
                        </motion.span>
                      ))}
                  </motion.p>
                </div>
              )}

              {currentDes && (
                <div
                  key={"description"}
                  className={`${
                    flip
                      ? "relative w-full h-fit"
                      : "relative w-full min-h-[40px] sm:min-h-[50px] md:min-h-[60px] lg:min-h-[70px]"
                  } flex items-start`}
                >
                  <motion.p
                    key={shouldAnimateDes ? `desc-${tick}` : "desc-static"}
                    initial={shouldAnimateDes ? { opacity: 0, y: 20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldAnimateDes ? { opacity: 0, y: -20 } : undefined}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-black/90 text-[12px] sm:text-sm md:text-base font-medium w-[90%] flex flex-wrap gap-x-1 leading-[1.3] sm:leading-[1.4]"
                  >
                    {currentDes
                      .split(" ")
                      .map((word, index) => (
                        <motion.span
                          key={(word + index).toString()}
                          initial={shouldAnimateDes ? { opacity: 0, y: 20 } : false}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                          className="inline-block"
                        >
                          {word}{" "}
                        </motion.span>
                      ))}
                  </motion.p>
                </div>
              )}
            </AnimatePresence>

            {button && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link
                  href={buttonLink}
                  onClick={handleButtonClick}
                  className="group h-fit bg-tiger font-dmsans font-semibold text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-base sm:text-lg md:text-xl hover:bg-navy transition-colors duration-300 tracking-tighter flex flex-row items-center gap-2 w-fit"
                >
                  {buttonTxt}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 sm:size-5 font-bold stroke-3 hidden group-hover:flex transition-transform duration-200"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              </motion.div>
            )}

            {video && (
              <div className="lg:w-[450px] md:w-[400px] w-[300px] max-w-[500px] aspect-video flex items-center justify-center overflow-hidden rounded-xl shadow-xl">
                <Video
                  src={homepage}
                  className="w-full h-full shadow-lg object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={true}
                  style={{ width: "100%", height: "100%", background: "#000" }}
                />
              </div>
            )}

            {/*
             * FIX 4 — Currency ticker.
             * Original: currency ? "hidden" : "flex" — completely inverted logic.
             * Also renamed prop internally to showCurrency to avoid shadowing state var.
             * Only fetches from API when showCurrency=true.
             */}
            {showCurrency && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-black/90 w-fit md:text-xl font-medium text-base px-4 py-2 rounded-full flex flex-row gap-2"
              >
                <div className="flex flex-row items-center gap-2">
                  <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--twemoji size-4 md:size-6" preserveAspectRatio="xMidYMid meet">
                    <path fill="#00247D" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"></path>
                    <path fill="#CF1B2B" d="M25.14 23l9.712 6.801a3.977 3.977 0 0 0 .99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8a3.988 3.988 0 0 0-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2a3.994 3.994 0 0 0-.991 1.749L7.372 13h3.487z"></path>
                    <path fill="#EEE" d="M36 21H21v10h2v-5.836L31.335 31H32a3.99 3.99 0 0 0 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9a3.983 3.983 0 0 0-1.148-2.8L25.141 13H23v-.943l9.915-6.942A4.001 4.001 0 0 0 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4a3.985 3.985 0 0 0-2.852 1.2l9.711 6.8H7.372L.157 7.949A3.968 3.968 0 0 0 0 9v.059L5.628 13H0v2h15V5h-2z"></path>
                    <path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"></path>
                  </svg>
                  GBP: <b>{currencyData.GBP.toFixed(2)}</b> &nbsp; &nbsp; &nbsp;
                </div>
                <div className="flex flex-row items-center gap-2">
                  <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--twemoji size-6" preserveAspectRatio="xMidYMid meet">
                    <path fill="#138808" d="M0 27a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4v-4H0v4z"></path>
                    <path fill="#EEE" d="M0 13h36v10H0z"></path>
                    <path fill="#F93" d="M36 13V9a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v4h36z"></path>
                    <circle fill="navy" cx="18" cy="18" r="4"></circle>
                    <circle fill="#EEE" cx="18" cy="18" r="3"></circle>
                    <path fill="#6666B3" d="M18 15l.146 2.264l1.001-2.035l-.73 2.147l1.704-1.498l-1.497 1.705l2.147-.731l-2.035 1.002L21 18l-2.264.146l2.035 1.001l-2.147-.73l1.497 1.704l-1.704-1.497l.73 2.147l-1.001-2.035L18 21l-.146-2.264l-1.002 2.035l.731-2.147l-1.705 1.497l1.498-1.704l-2.147.73l2.035-1.001L15 18l2.264-.146l-2.035-1.002l2.147.731l-1.498-1.705l1.705 1.498l-.731-2.147l1.002 2.035z"></path>
                    <circle fill="navy" cx="18" cy="18" r="1"></circle>
                  </svg>
                  INR: <b>{currencyData.INR.toFixed(2)}</b>
                </div>
              </motion.div>
            )}
          </div>

          {/*
           * FIX 5 — Mobile image was invisible.
           * Original class: "lg:hidden lg:flex hidden" — self-contradictory, hidden always wins.
           * Fixed: "flex lg:hidden" — visible on mobile/tablet, hidden on lg+ (right panel takes over).
           */}
          <div className="w-full md:w-[70%] h-1/2 mt-auto p-6 rounded-xl flex lg:hidden">
            <ImageSlider images={images} />
          </div>
        </WavyBackground>
      </div>

      {/* ── Right panel: image slideshow, desktop only ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:flex relative w-full lg:w-1/2 h-full flex-col items-center justify-center overflow-hidden"
      >
        <ImageSlider images={images} />
      </motion.div>
    </div>
  );
}