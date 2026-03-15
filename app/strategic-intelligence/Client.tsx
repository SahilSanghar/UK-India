"use client";

import React, { useEffect } from "react";
import SimpleLander from "@/components/simpleLander";
import { useInView } from "react-intersection-observer";
import BoxImageText from "@/components/BoxImageText";
import { useSetNavbar } from "@/lib/navbar-context";
import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/components/LiquidButton";
import Fullscreen from "@/components/Fullscreen";
import Carousel from "@/components/Carousel";
import StatCard from "@/components/StatCard";
import Lander from "@/components/Lander";
import ImageSlider from "@/components/ImageSlider";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
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
      des: string;
      link: string;
      image: string;
    }[];
  };
}

export default function Client({ page }: { page: PageProps }) {
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

  const services = [
    {
      name: "Market Analysis:",
      des: "Our forward-looking research gives you a deep understanding of the Indian market, equipping your business with actionable insights",
    },
    {
      name: "Market Positioning:",
      des: "Through gap analysis and competitor intelligence, we position your products or services to maximise visibility and market trust. This approach strengthens long-term growth and acts as a catalyst for collaboration and investment",
    },
    {
      name: "Growth Strategies:",
      des: "We identify opportunities for innovation and expansion, guiding you through new product development, service customisation, market entry, and strategic partnerships to accelerate growth.",
    },
    {
      name: "Adaptability and Resilience:",
      des: "Our services ensure your business remains agile and responsive to changes in the market, helping you stay ahead of the competition.",
    },
    {
      name: "Business Plan Development:",
      des: "Our data-driven approach helps you craft a robust business plan, identifying market opportunities and setting realistic goals to drive your business forward.",
    },
    {
      name: "Risk Management:",
      des: "Our local intelligence provides last-mile connectivity, enabling confident decision-making and safeguarding your business. We proactively track regulatory changes and ecosystem developments to help you anticipate risks early.",
    },
    {
      name: "Decision-Making Support:",
      des: "We provide the intelligence needed to make informed, confident decisions that align with your long-term business goals.",
    },
  ];

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
            : [
                {
                  image: "/person.jpg",
                  position: "50%_50%",
                },
              ]
        }
      />
      {/* <SimpleLander
        ref={landerRef as unknown as React.RefObject<HTMLDivElement>}
        heading1="Influence"
        description="Shaping the Conversations That Shape Policy"
        image="/home-card1.png"
        button={true}
        buttonLink="/influence#more"
      /> */}

      <section id="more">
        {/* <div className="w-full h-fiy py-20">
          <p className=" text-xl font-bold w-[60%] m-auto text-justify">
            We work to create a level playing field where industries can grow
            with confidence, clarity, and fairness. This is achieved through
            sustained advocacy with government and regulatory bodies, and by
            facilitating high-impact engagements including policy dialogues,
            roundtables, forums, receptions, delegations, and direct
            industry–government interactions.
          </p>
        </div> */}
        <p className="text-2xl md:text-3xl xl:text-4xl  font-bold text-navy text-center xl:w-[60%] w-[90%] mx-auto my-20">
          {page.box?.[0]?.title || "Our Strategic Intelligence Services"}
        </p>
        <BoxImageText
          // title={page.box?.[0]?.title || ""}
          description={page.box?.[0]?.content || ""}
          buttonText={page.box?.[0]?.buttonTxt || ""}
          buttonLink={page.box?.[0]?.link || ""}
          className="mb-20"
          images={
            page.box?.[0]?.image && page.box[0].image.length > 0
              ? page.box[0].image.map((image: string) => ({
                  image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${image}.webp`,
                  position: "center",
                }))
              : [
                  {
                    image: "/noble2.jpg",
                    position: "center",
                  },
                  {
                    image: "/noble3.jpg",
                    position: "center",
                  },
                ]
          }
          flip={false}
        />

        <div className="w-full flex justify-center items-center bg-gradient-to-b from-blue-950 to-navy/90 py-20">
          <div
            className="z-20 w-full max-w-5xl flex flex-col justify-center items-center text-center gap-14"
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="md:text-5xl text-3xl font-bold text-white flex md:w-[40%] w-fit text-center justify-center items-center">
              {page.fullscreen?.title}
            </h1>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 md:px-0 px-4">
              {page.fullscreen?.cards.map((card, index) => (
                <motion.div
                  initial={{
                    y: 10,
                    opacity: 0,
                    scale: 1,
                  }}
                  whileInView={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{
                    scale: 1.1,
                    transition: { duration: 0.1 },
                  }}
                  transition={{ duration: 0.1 }}
                  key={index}
                  className="flex flex-col md:gap-2 gap-0 items-center justify-center text-center w-full bg-white/5 p-6 rounded-xl"
                >
                  <div className="p-5 bg-tiger rounded-full flex items-center justify-center mb-3 w-15 h-15">
                    <Image
                      src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${card.image}.webp`}
                      alt={card.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:text-xl text-base font-bold text-white text-center md:w-[80%] w-full mb-1">
                    {card.title}
                  </div>
                  <div
                    className="xl:text-base text-xs font-normal text-white/90 text-center md:w-[80%] w-[95%]"
                    dangerouslySetInnerHTML={{
                      __html: normalizeRichTextHtml(card.des || ""),
                    }}
                  ></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <BoxImageText
          // title={page.box?.[0]?.title || ""}
          description={page.box?.[1]?.content || ""}
          buttonText={page.box?.[1]?.buttonTxt || ""}
          buttonLink={page.box?.[1]?.link || ""}
          className="my-20"
          images={
            page.box?.[1]?.image && page.box[1].image.length > 0
              ? page.box[1].image.map((image: string) => ({
                  image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${image}.webp`,
                  position: "center",
                }))
              : [
                  {
                    image: "/noble2.jpg",
                    position: "center",
                  },
                  {
                    image: "/noble3.jpg",
                    position: "center",
                  },
                ]
          }
          flip={true}
        />

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
