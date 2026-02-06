"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import LiquidButton from "./LiquidButton";
import { normalizeRichTextHtml } from "../lib/normalizeRichTextHtml";

interface CarouselProps {
  data: Array<{
    quote: string;
    des?: string;
    name?: string;
    role?: string;
    image: string;
    link?: string;
  }>;
}

export default function Carousel({ data }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [y, setY] = useState(0);
  const [itemHeight, setItemHeight] = useState(116); // Default mobile height (100px + 16px gap)
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [newData] = useState([...data, ...data]);

  // Calculate item height based on screen size
  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      if (width >= 768) {
        setItemHeight(166); // Desktop: 150px + 16px gap
      } else {
        setItemHeight(110); // Mobile: 100px + 16px gap
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const Next = () => {
    setIndex((prev) => {
      const newIndex = prev === data.length - 1 ? 0 : prev + 1;
      setY(-itemHeight * newIndex);
      return newIndex;
    });
  };

  const Prev = () => {
    setIndex((prev) => {
      const newIndex = prev === 0 ? data.length - 1 : prev - 1;
      setY(-itemHeight * newIndex);
      return newIndex;
    });
  };

  const scrollTo = (idx: number) => {
    if (idx > data.length - 1) {
      setY(0);
      setIndex(0);
    } else if (idx < 0) {
      setY(-itemHeight * (data.length - 1));
      setIndex(0);
    } else {
      setY(-itemHeight * idx);
      setIndex(idx);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovered || data.length <= 1) return;

    const interval = setInterval(() => {
      Next();
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, data.length, itemHeight]);

  return (
    <div
      className="relative w-full max-w-[1000px] min-h-[400px] sm:h-[500px] overflow-hidden mx-auto flex flex-col sm:flex-row gap-3 sm:gap-5 px-5 sm:px-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Navigation */}
      <div className="w-full sm:w-fit h-[120px] sm:h-full relative flex flex-row sm:flex-col bg-white rounded-2xl sm:rounded-4xl overflow-hidden ">
        <motion.div
          initial={{ y: 0, x: 0 }}
          animate={{
            y: !isMobile ? `${y}px` : 0,
            x: isMobile ? `${y}px` : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-fit h-full items-center flex flex-row sm:flex-col rounded-2xl sm:rounded-4xl gap-2 sm:gap-4 p-3 sm:p-3"
        >
          {newData.map(
            (
              item: { image: string; name?: string; role?: string },
              idx: number
            ) => (
              <div
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`w-[100px] h-[100px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] rounded-2xl sm:rounded-4xl flex items-center justify-center relative transition-all duration-300 cursor-pointer shrink-0 ${
                  idx === index
                    ? "border-2 sm:border-4 border-tiger/70 scale-110 sm:scale-100 md:h-[200px]"
                    : "grayscale opacity-60 hover:opacity-80"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.name || ""}
                  width={0}
                  height={0}
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 150px"
                  className="rounded-xl sm:rounded-3xl object-cover w-full h-full flex z-10"
                />
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden rounded-2xl sm:rounded-3xl bg-white">
        <div className="flex">
          <div
            key={index}
            className="shrink-0 w-full min-h-[300px] sm:min-h-[400px] md:h-[500px] flex items-center justify-center"
          >
            <div className="w-full h-full flex flex-col">
              <div className="w-full h-full rounded-b-md flex flex-col justify-start p-4 sm:p-6 md:p-10 lg:p-15">
                <div className="h-full flex flex-col justify-between gap-4 overflow-y-auto pr-2">
                  <motion.p
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    key={newData[index].quote}
                  >
                    {newData[index].quote}
                  </motion.p>
                  {newData[index].des && (
                    <motion.div
                      className="text-xs sm:text-sm text-gray-600 font-medium w-full text-left [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p:empty]:before:content-['\\00a0']"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      key={newData[index].quote}
                      dangerouslySetInnerHTML={{
                        __html: normalizeRichTextHtml(newData[index].des || ""),
                      }}
                    ></motion.div>
                  )}
                  {newData[index].link && (
                    <motion.p
                      className="text-xs sm:text-sm text-gray-600 font-medium w-full mt-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      key={newData[index].link}
                    >
                      <LiquidButton
                        text="Read More"
                        link={newData[index].link || ""}
                      />
                    </motion.p>
                  )}
                  <div className="flex flex-col gap-2 mt-auto">
                    <motion.p
                      className="text-base sm:text-lg md:text-xl text-gray-800 font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      key={newData[index].name}
                    >
                      {newData[index].name}
                    </motion.p>
                    <motion.p
                      className="text-xs sm:text-sm text-gray-600 font-medium w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      key={newData[index].role}
                    >
                      {newData[index].role}
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        className="absolute cursor-pointer left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg hover:bg-white flex items-center justify-center transition-colors z-20 active:scale-95"
        aria-label="Previous slide"
        onClick={() => Prev()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-navy"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        className="absolute cursor-pointer right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg hover:bg-white flex items-center justify-center transition-colors z-20 active:scale-95"
        aria-label="Next slide"
        onClick={() => Next()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-navy rotate-180"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* dots */}
      {/* <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
        {data.map((item, my_index) => (
          <button
            key={my_index}
            type="button"
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-200 ${
              index === my_index
                ? "bg-navy scale-110"
                : "bg-navy/30 hover:bg-navy/60"
            }`}
            aria-label={`Go to slide ${my_index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
}
