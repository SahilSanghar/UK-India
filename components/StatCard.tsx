"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StatCard({
  animation,
  title,
  number,
  valueAfter,
  valueBefore,
  disclaimer,
  description,
  color,
  link,
}: {
  title?: string;
  number: number;
  valueAfter?: string;
  color?: "black" | "white";
  valueBefore?: string;
  description: string;
  disclaimer?: string;
  link?: string;
  animation: "left" | "center" | "right";
}) {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const duration = 2000; // total duration of animation in ms
  const frame = useRef<number>(0);
  const router = useRouter();
  useEffect(() => {
    let start: number | null = null;

    function animateCountUp(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easedProgress = Math.min(progress / duration, 1);
      const currentValue = Math.floor(easedProgress * number);

      setDisplayedNumber(currentValue);

      if (easedProgress < 1) {
        frame.current = requestAnimationFrame(animateCountUp);
      } else {
        setDisplayedNumber(number);
      }
    }

    frame.current = requestAnimationFrame(animateCountUp);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [number]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: animation == "left" ? "-10%" : animation === "center" ? "0" : "10%",
        y: animation == "center" ? "10%" : "0%",
      }}
      animate={{
        transition: {
          duration: 0.5,
        },
      }}
      whileHover={{
        scale: 1.02,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.5,
        },
      }}
      transition={{
        duration: 0.1,
      }}
      onViewportLeave={() => {
        setDisplayedNumber(0);
        frame.current = requestAnimationFrame((timestamp: number) => {
          let start: number | null = null;
          function animateCountUp(ts: number) {
            if (!start) start = ts;
            const progress = ts - start;
            const easedProgress = Math.min(progress / duration, 1);
            const currentValue = Math.floor(easedProgress * number);
            setDisplayedNumber(currentValue);
            if (easedProgress < 1) {
              frame.current = requestAnimationFrame(animateCountUp);
            } else {
              setDisplayedNumber(number);
            }
          }
          animateCountUp(timestamp);
        });
      }}
      className="flex flex-col gap-1 w-full sm:w-[300px] md:w-[350px] h-auto min-h-fit sm:min-h-fit px-4 sm:px-0"
    >
      <p
        className={`text-base sm:text-lg md:text-xl font-bold ${
          color === "white" ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </p>
      <span className="text-tiger text-3xl sm:text-4xl md:text-5xl font-bold wrap-break-word">
        {valueBefore}
        {displayedNumber}
        {valueAfter}
      </span>
      <p
        dangerouslySetInnerHTML={{ __html: disclaimer || "" }}
        className={`text-sm sm:text-base md:text-base font-bold leading-tight ${
          color == "white" ? "text-white/80" : "text-black/80"
        } `}
      ></p>
      <p
        dangerouslySetInnerHTML={{ __html: description }}
        className={`text-sm sm:text-base md:text-base font-bold leading-tight ${
          color == "white" ? "text-white" : "text-black"
        } `}
      ></p>
      {link && (
        <>
          <hr className="w-1/2 mx-auto h-2 my-2 sm:my-3 border-black" />
          <motion.div
            onClick={() => router.push(link)}
            className="w-fit mx-auto cursor-pointer font-bold text-navy border-2 border-navy rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base hover:bg-navy hover:text-white transition-all duration-200"
          >
            Read More
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
