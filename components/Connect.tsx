import React from "react";
import LiquidButton from "./LiquidButton";
import Image from "next/image";

export default function Connect({
  title,
  description,
  image,
  compact = false,
}: {
  title: string;
  description: string;
  image: string;
  compact?: boolean;
}) {
  return (
    <div className="w-full md:h-fit h-screen flex md:flex-row flex-col justify-center items-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center text-center md:h-fit h-full md:p-0 p-10">
        <h1 className="text-4xl md:text-5xl font-bold text-navy">{title}</h1>
        <div
          className="md:text-lg text-sm font-medium leading-relaxed w-full md:w-[60%] m-auto text-center"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <LiquidButton text="Contact Us" link="/contact" />
      </div>
      <div
        className={`w-full md:h-screen h-1/2 max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center text-center ${
          compact ? "" : "bg-red-200"
        }`}
      >
        <Image
          src={image}
          alt="influence"
          width={0}
          height={0}
          sizes="100vw"
          className={
            compact
              ? "w-[calc(100%-50px)] h-[calc(100%-50px)] object-cover"
              : "w-full h-full object-cover"
          }
        />
      </div>
    </div>
  );
}
