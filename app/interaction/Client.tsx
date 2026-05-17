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
import ImageSlider from "@/components/ImageSlider";
import Connect from "@/components/Connect";
import BoxImageText from "@/components/BoxImageText";
import axios from "axios";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

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
  contact?: {
    title: string;
    content: string;
    image: string;
  };
}

export default function Page({ page }: { page: PageProps }) {
  const setNavbar = useSetNavbar();
  const [mobile, setMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      setNavbar(mobile ? false : true);
    } else if (landerInView) {
      setNavbar(mobile ? false : false);
    } else if (membershipInView) {
      setNavbar(mobile ? false : true);
    } else {
      setNavbar(mobile ? false : false);
    }
  }, [intelligenceInView, membershipInView, landerInView, setNavbar, mobile]);

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
        <BoxImageText
          title={page.box?.[0]?.title || ""}
          description={page.box?.[0]?.content || ""}
          buttonText={page.box?.[0]?.buttonTxt || ""}
          buttonLink={page.box?.[0]?.link || ""}
          className="my-20"
          images={
            page.box?.[0]?.image && page.box[0].image.length > 0
              ? page.box[0].image.map((img: string) => ({
                  image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${img}.webp`,
                  position: "center",
                }))
              : [
                  { image: "/noble2.jpg", position: "center" },
                  { image: "/noble3.jpg", position: "center" },
                ]
          }
          flip={false}
        />

        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(251 206 188)"
          gradientBackgroundEnd="rgb(241 92 35)"
          firstColor="3, 107, 252"
          secondColor="2, 87, 207"
          thirdColor="1, 30, 71"
          fourthColor="139, 187, 254"
          fifthColor="139, 187, 254"
          interactive={false}
          containerClassName="w-full min-h-screen md:h-screen h-[100vh] flex justify-center items-center bg-navy relative"
        >
          <div
            className="z-10 absolute top-0 left-0 bottom-0 right-0 mx-auto w-full min-h-screen h-auto flex flex-col justify-center items-center text-center gap-12 sm:gap-16 md:gap-20 py-10 sm:py-20 px-4"
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white flex w-[80%] md:w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
              {page.stats?.title}
            </h1>
            <div className="w-full h-fit flex flex-col sm:flex-row gap-8 sm:gap-10 md:gap-15 justify-center text-center px-0">
              {page.stats?.cards?.map((stat, idx) => (
                <StatCard
                  key={stat.title + idx}
                  animation={idx === 0 ? "left" : idx === 2 ? "right" : "center"}
                  number={stat.number}
                  valueBefore={stat.valueBefore}
                  valueAfter={stat.valueAfter}
                  title={stat.title}
                  description={stat.des}
                  disclaimer={stat.disclaimer}
                  color="white"
                />
              ))}
            </div>
          </div>
        </BackgroundGradientAnimation>

        <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
          <Carousel
            data={
              Array.isArray(page?.testimonials)
                ? page.testimonials.map(
                    (testimonial: {
                      quote: string;
                      des: string;
                      name: string;
                      role: string;
                      image: string;
                      link: string;
                    }) => ({
                      quote: testimonial.quote,
                      des: testimonial.des,
                      name: testimonial.name,
                      role: testimonial.role,
                      image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${testimonial.image}.webp`,
                      link: testimonial.link,
                    }),
                  )
                : []
            }
          />
        </div>

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