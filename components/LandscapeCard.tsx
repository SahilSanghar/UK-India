import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface LandscapeCardProps {
  title1: string;
  date?: string;
  landscape?: boolean;
  image: string;
  link: string;
  animation: "left" | "center" | "right";
  key?: React.Key;
}

export default function LandscapeCard({
  title1,
  date,
  landscape,
  image,
  link,
  animation,
  key,
}: LandscapeCardProps) {
  const betterDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
        .replace(/ /g, " ")
    : "";
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: animation == "left" ? "-10%" : animation === "center" ? "0" : "10%",
        y: animation == "center" ? "10%" : "0%",
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
      className="flex flex-col text-black cursor-pointer md:w-[350px] md:h-[400px] w-[300px] h-[340px] bg-white border-2 border-black/10  rounded-2xl"
      onClick={() => window.open(link)}
    >
      <div className="w-full aspect-video  overflow-hidden border-b-2 border-black/10">
        <Image
          src={image}
          alt={title1}
          width={0}
          height={0}
          sizes="100vw"
          className="object-cover object-center duration-300 rounded-t-2xl w-full h-full"
        />
      </div>
      <div className="w-full h-[200px]  rounded-b-2xl p-5 flex flex-col justify-between">
        <h3 className=" text-xl font-bold line-clamp-4" dangerouslySetInnerHTML={{ __html: title1 || "" }}></h3>
        <p className="text-sm font-medium mt-auto flex">
          {betterDate}
        </p>
      </div>
    </motion.div>
  );
}
