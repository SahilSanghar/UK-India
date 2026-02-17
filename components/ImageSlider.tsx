import { AnimatePresence, motion, time } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageSliderProps {
  rounded?: boolean;
  animation?: "none" | "up" | "zoom";
  time?: number;
  images: { image: string; position: string }[];
}

export default function ImageSlider({
  rounded = false,
  animation = "zoom",
  time,
  images,
}: ImageSliderProps) {
  const [currentImageState, setCurrentImageState] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentImageState((prev) => (prev + 1) % images.length);
      },
      time ? time : 5000,
    );
    return () => clearInterval(interval);
  }, [images, currentImageState]);
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
        rounded ? "rounded-4xl" : ""
      }`}
    >
      {/* slideshow images */}
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
          className="w-full h-full"
        >
          <div className="relative w-full h-full">
            <Image
              src={images![currentImageState].image}
              alt="logo"
              fill
              sizes="100vw"
              className={`object-cover scale-110 ${
                rounded ? "rounded-4xl" : ""
              } object-[${images![currentImageState].position}]`}
              priority
            />
            {/* color overlay */}
            <div className="absolute inset-0 w-full h-full bg-"></div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
