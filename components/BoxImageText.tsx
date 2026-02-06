import React from "react";
import LiquidButton from "./LiquidButton";
import { motion } from "framer-motion";
import ImageSlider from "./ImageSlider";
import { normalizeRichTextHtml } from "../lib/normalizeRichTextHtml";

interface BoxImageTextProps {
  title?: string;
  description: string | React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
  flip?: boolean;
  images: { image: string; position: string }[];
}

export default function BoxImageText({
  title,
  description,
  buttonText,
  buttonLink,
  className,
  flip = false,
  images,
}: BoxImageTextProps) {
  return (
    <motion.div
      className={`flex flex-col md:flex-row ${className} ${
        flip ? "md:flex-row-reverse" : "md:flex-row"
      } w-[95%] sm:w-[90%] min-h-[500px] sm:min-h-[550px] md:min-h-[600px] md:h-fit mx-auto items-stretch justify-center gap-4 sm:gap-6`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
        className="w-full xl:w-1/2 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center justify-center bg-black/5 rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-6 md:p-8 xl:p-15 h-auto"
      >
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-center justify-center w-full">
          <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-bold text-navy text-center w-full md:w-[90%] xl:w-[70%] mx-auto">
            {title}
          </h1>
          <div
            className="text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base 2xl:text-base leading-tight sm:leading-relaxed md:leading-normal font-medium px-4 sm:px-6 md:px-8 lg:px-10 mb-auto w-full text-justify [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:before:content-['\\00a0']"
            dangerouslySetInnerHTML={{
              __html: normalizeRichTextHtml(description as string),
            }}
          />
          {buttonText && buttonLink && (
            <LiquidButton text={buttonText} link={buttonLink} />
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
        className="w-full xl:w-1/2 flex items-center bg-black/5 justify-center relative rounded-2xl sm:rounded-3xl md:rounded-4xl p-4 sm:p-6 md:p-8 lg:p-10 h-auto"
      >
        <ImageSlider rounded={true} animation="up" images={images} />
      </motion.div>
    </motion.div>
  );
}
