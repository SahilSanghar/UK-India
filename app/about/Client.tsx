"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSetNavbar } from "@/lib/navbar-context";
import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/components/LiquidButton";
import Fullscreen from "@/components/Fullscreen";
import Carousel from "@/components/Carousel";
import StatCard from "@/components/StatCard";
import Lander from "@/components/Lander";
import BoxImageText from "@/components/BoxImageText";
import ImageSlider from "@/components/ImageSlider";
import axios from "axios";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import InfoCard from "@/components/InfoCard";
import Connect from "@/components/Connect";
import { normalizeRichTextHtml } from "@/lib/normalizeRichTextHtml";

interface PageProps {
  id: string;
  title: string;
  type: string;
  lander: {
    title: string[];
    title2?: string[];
    des: string[];
    image: string[];
    flip: boolean;
    button: {
      enable: boolean;
      text: string;
      link: string;
    };
  };
  stats?: {
    title: string;
    cards: {
      title: string;
      valueBefore: string;
      valueAfter: string;
      number: number;
      des: string;
      disclaimer: string;
      link: string;
    }[];
    circle?: {
      title: string;
      image: string;
    }[];
  };
  membership?: {
    title: string;
    subtitle: string;
    des: string;
    image: string;
    buttonTxt: string;
    link: string;
  };
  testimonials?: {
    quote: string;
    des: string;
    name: string;
    role: string;
    image: string;
    link: string;
  }[];
  box?: {
    title: string;
    content: string;
    buttonTxt: string;
    link: string;
    image: string[];
  }[];
  sectors?: {
    title: string;
    image: string;
  }[];
  contact?: {
    title: string;
    content: string;
    image: string;
  };
  cards?: {
    title: string;
    des: string;
    image: string;
  }[];
  fullscreen?: {
    title: string;
    des: string;
    cards: {
      title: string;
      buttonTxt: string;
      link: string;
      image: string;
    }[];
  };
}

export default function About({ page }: { page: PageProps }) {
  const setNavbar = useSetNavbar();

  const { ref: intelligenceRef, inView: intelligenceInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });
  const { ref: landerRef, inView: landerInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });
  const { ref: membershipRef, inView: membershipInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });

  useEffect(() => {
    if (intelligenceInView) {
      setNavbar(true);
    } else if (landerInView) {
      setNavbar(false);
    } else if (membershipInView) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  }, [intelligenceInView, membershipInView, landerInView, setNavbar]);

  return (
    <>
      <Lander
        title_data={page.lander.title.map((t, i) => ({
          title: t,
          title2: page.lander.title2?.[i] ?? undefined,
          des: page.lander.des[i] ?? undefined,
        }))}
        button={page.lander.button?.enable || false}
        buttonTxt={page.lander.button?.text || ""}
        buttonLink={page.lander.button?.link || ""}
        currency={true}
        flip={page.lander.flip || false}
        images={
          page.lander.image && page.lander.image.length > 0
            ? page.lander.image.map((img) => ({
                image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${img}.webp`,
                position: "50%_50%",
              }))
            : [{ image: "/person.jpg", position: "50%_50%" }]
        }
      />

      <section id="more">
        {/* Key Sectors */}
        {Array.isArray(page.sectors) && page.sectors.length > 0 && (
          <section className="w-full pt-20 bg-white text-black">
            <div className="w-full flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-bold text-navy text-center mb-2">
                Key Sectors
              </h2>
              <p className="md:text-lg text-base text-gray-700 mx-10 md:mx-0 text-center mb-10 max-w-2xl">
                UKIBC supports companies across a wide range of sectors
              </p>
              <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-3 gap-x-2 md:gap-y-5 md:gap-x-4 justify-items-center w-[96%] sm:w-[90%] max-w-7xl">
                {page.sectors.map((sector, index) => (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={index}
                    className="flex flex-col hover:scale-105 cursor-pointer text-center bg-navy/5 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px] rounded-3xl md:rounded-4xl justify-center items-center"
                  >
                    <Image
                      src={`https://d2paj8ptqa22jg.cloudfront.net/pages/interaction/${sector.image}.webp`}
                      alt={sector.title}
                      width={56}
                      height={56}
                      className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-1 p-2 md:p-3"
                    />
                    <span className="text-xs sm:text-sm md:text-base font-bold leading-tight p-2">
                      {sector.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cards */}
        <div className="flex gap-5 md:flex-row flex-col my-20 items-center justify-center">
          {Array.isArray(page?.cards) &&
            page.cards.map(
              (
                card: {
                  title: string;
                  des: string;
                  image: string;
                  buttonTxt?: string;
                  link?: string;
                },
                idx: number,
              ) => (
                <InfoCard
                  key={idx}
                  animation={idx % 2 === 0 ? "left" : "right"}
                  title1={card.title}
                  des={card.des}
                  image={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${card.image}.webp`}
                  buttonText={card.buttonTxt}
                  large={true}
                  link={card.link}
                />
              ),
            )}
        </div>

        {/* Box sections */}
        <div className="flex gap-5 flex-col my-20 text-navy">
          <h1 className="md:text-3xl text-xl font-bold text-center md:w-[70%] w-[90%] mx-auto mb-5">
            {page.box?.[0]?.title}
          </h1>
          <BoxImageText
            description={page.box?.[0]?.content || ""}
            buttonText={page.box?.[0]?.buttonTxt || ""}
            buttonLink={page.box?.[0]?.link || ""}
            className=""
            images={
              page.box?.[0]?.image && page.box[0].image.length > 0
                ? page.box[0].image.map((image: string) => ({
                    image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${image}.webp`,
                    position: "center",
                  }))
                : [
                    { image: "/noble2.jpg", position: "center" },
                    { image: "/noble3.jpg", position: "center" },
                  ]
            }
            flip={false}
          />

          <BoxImageText
            title={page.box?.[1]?.title || ""}
            description={page.box?.[1]?.content || ""}
            buttonText={page.box?.[1]?.buttonTxt || ""}
            buttonLink={page.box?.[1]?.link || ""}
            className=""
            images={
              page.box?.[1]?.image && page.box[1].image.length > 0
                ? page.box[1].image.map((image: string) => ({
                    image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${image}.webp`,
                    position: "center",
                  }))
                : [
                    { image: "/noble2.jpg", position: "center" },
                    { image: "/noble3.jpg", position: "center" },
                  ]
            }
            flip={true}
          />
        </div>

        {/* Fullscreen gradient section */}
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(1 45 107)"
          gradientBackgroundEnd="rgb(0 11 25)"
          firstColor="3, 107, 252"
          secondColor="2, 87, 207"
          thirdColor="1, 30, 71"
          fourthColor="139, 187, 254"
          fifthColor="139, 187, 254"
          interactive={false}
          containerClassName="w-full min-h-screen md:h-screen h-[150vh] flex justify-center items-center bg-navy relative"
        >
          <div
            className="z-10 absolute top-0 left-0 bottom-0 right-0 mx-auto w-full min-h-screen h-auto flex flex-col justify-center items-center text-center gap-10 sm:gap-16 md:gap-20 py-10 sm:py-20"
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <div className="flex flex-col gap-3 sm:gap-5 items-center justify-center w-full px-4">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white flex leading-tight max-w-2xl mx-auto">
                {page.fullscreen?.title}
              </h1>
              <div
                className="text-white text-base sm:text-lg md:text-xl w-full sm:w-[85%] md:w-[70%] mx-auto [&_p]:m-0 [&_p:empty]:h-[1em]"
                dangerouslySetInnerHTML={{
                  __html: normalizeRichTextHtml(page.fullscreen?.des || ""),
                }}
              />
            </div>
            <div className="w-full h-fit flex flex-col sm:flex-row gap-7 sm:gap-6 md:gap-10 lg:gap-15 justify-center text-center px-4">
              {page.fullscreen?.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 items-center justify-center w-full sm:w-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-10 h-10 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-white text-base sm:text-lg md:text-xl font-bold">
                    {card.title}
                  </p>
                  <div className="w-full flex justify-center">
                    <LiquidButton text={card.buttonTxt} link={card.link} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BackgroundGradientAnimation>

        {/* Connect */}
        <Connect
          title={page.contact?.title || "Connect with us:"}
          description={
            page.contact?.content ||
            "To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
          }
          image={
            `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${page.contact?.image}.webp` ||
            "/connect.webp"
          }
        />
      </section>
    </>
  );
}