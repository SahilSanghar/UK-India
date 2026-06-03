import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageSliderProps {
  rounded?: boolean;
  animation?: "none" | "up" | "zoom";
  time?: number;
  images: { image: string; position: string }[];
}

// FIX 6: Tailwind cannot resolve dynamic class names like object-[${position}] at build time.
// The class string is constructed at runtime, so Tailwind's JIT scanner never sees it and never
// generates the CSS. Fix: convert the position string to an inline style instead.
function positionToObjectPosition(position: string): string {
  // Handles formats like "50%_50%", "center", "top", "bottom", "50% 50%"
  return position.replace(/_/g, " ");
}

export default function ImageSlider({
  rounded = false,
  animation = "zoom",
  time,
  images,
}: ImageSliderProps) {
  const [currentImageState, setCurrentImageState] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(
      () => {
        setCurrentImageState((prev) => (prev + 1) % images.length);
      },
      time ? time : 5000,
    );
    return () => clearInterval(interval);
  }, [images, time]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
        rounded ? "rounded-4xl" : ""
      }`}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={currentImageState}
          initial={{ scale: 1, y: 0, opacity: 1 }}
          animate={
            animation === "zoom"
              ? { scale: 1.1, opacity: 1 }
              : animation === "up"
                ? { y: -10, opacity: 1 }
                : {}
          }
          transition={
            animation === "zoom"
              ? { duration: 10, opacity: { duration: 0.5, ease: "easeInOut" } }
              : animation === "up"
                ? {
                    duration: 10,
                    y: { duration: 0.5, ease: "easeInOut" },
                    opacity: { duration: 0.5, ease: "easeInOut" },
                  }
                : {}
          }
          className="absolute inset-0 w-full h-full"
        >
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageState].image}
              alt="slider image"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover scale-110 ${rounded ? "rounded-4xl" : ""}`}
              // FIX 6: Use inline style for object-position instead of dynamic Tailwind class
              style={{
                objectPosition: positionToObjectPosition(
                  images[currentImageState].position
                ),
              }}
              priority
            />
            {/* color overlay */}
            <div className="absolute inset-0 w-full h-full" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}