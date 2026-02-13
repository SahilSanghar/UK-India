import React from "react";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FullscreenProps {
  ref: React.RefObject<HTMLDivElement>;
  title1?: string;
  title2?: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function Fullscreen({ ref, title1, title2, description, image, buttonText, buttonLink }: FullscreenProps) {
  const router = useRouter();
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(1 45 107)"
      gradientBackgroundEnd="rgb(0 11 25)"
      firstColor="3, 107, 252"
      secondColor="2, 87, 207"
      thirdColor="1, 30, 71"
      fourthColor="139, 187, 254"
      fifthColor="139, 187, 254"
      interactive={false}
      containerClassName="w-full min-h-screen md:h-screen h-[150vh]  flex  justify-center items-center bg-navy relative"
    >
      {/* <AuroraBackground> */}
      <div
        className="md:w-[80%] w-[90%] z-10 left-0 right-0 top-0 bottom-0 absolute flex flex-col md:flex-row items-center gap-10 md:gap-0 justify-center md:justify-normal mx-auto"
        ref={ref as unknown as React.RefObject<HTMLDivElement>}
      >
        <div className="w-full md:w-1/2  flex flex-col gap-4 justify-center px-4 md:px-12">
          <p className="text-4xl md:text-5xl font-bold text-white mb-2">
            {title1?.split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap mr-2">
                {word.split("").map((char, cIdx) => (
                  <motion.span
                    key={cIdx}
                    className="text-white inline-block"
                    initial={{ rotateX: 90, opacity: 0 }}
                    whileInView={{ rotateX: 0, opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: (wIdx * 5 + cIdx) * 0.1,
                    }}
                    viewport={{ once: false }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </p>
          <p className="text-white text-lg font-bold italic mb-2">
            {title2 || "The Right Rooms. The Right People."}
          </p>
          <p className="text-white text-base md:text-lg leading-5 font-medium mb-6">
            {description}
          </p>
          {/* <LiquidButton text="Join the network" link="/membership" /> */}
          <div
            onClick={() => router.push(buttonLink || "/")}
            className="rounded-full cursor-pointer bg-tiger px-8 py-3 text-sm font-semibold tracking-wide text-white  transition hover:bg-mix hover:text-black hover:scale-105 duration-200 w-max"
          >
            {buttonText || "JOIN THE NETWORK"}
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center px-4 md:px-0 mt-8 md:mt-0">
          <Image
            src={image}
            alt="membership-image"
            width={600}
            height={337}
            sizes="(max-width: 768px) 90vw, 600px"
            className="rounded-xl object-cover max-w-full h-auto shadow-lg"
            priority
          />
        </div>
      </div>
      {/* </AuroraBackground> */}
    </BackgroundGradientAnimation>
  );
}
