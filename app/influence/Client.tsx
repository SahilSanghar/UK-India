"use client";

import React, { useEffect, useState } from "react";
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
}

export default function Influence({ page }: { page: PageProps }) {
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

        <BoxImageText
          title={page.box?.[0]?.title || ""}
          description={page.box?.[0]?.content || ""}
          buttonText={page.box?.[0]?.buttonTxt || ""}
          buttonLink={page.box?.[0]?.link || ""}
          className="my-20"
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

        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(251 206 188)"
          gradientBackgroundEnd="rgb(241 92 35)"
          firstColor="3, 107, 252"
          secondColor="2, 87, 207"
          thirdColor="1, 30, 71"
          fourthColor="139, 187, 254"
          fifthColor="139, 187, 254"
          interactive={false}
          containerClassName="w-full min-h-screen md:h-screen h-[150vh]  flex  justify-center items-center bg-navy relative"
        >
          <div
            className="z-10 absolute top-0 left-0 mx-auto w-full min-h-screen h-full flex flex-col justify-center items-center text-center py-16 px-4 sm:px-6 gap-10 sm:gap-16"
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="text-2xl xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl font-bold text-white flex w-[80%] sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
              {page.stats?.title || ""}
            </h1>
            <ul className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-center w-full">
              {page.stats?.circle?.map((card, index) => (
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
                  className="flex flex-col gap-2 items-center justify-center w-full sm:w-auto"
                >
                  <div className="w-25 px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7 bg-tiger rounded-full flex items-center justify-center">
                    <Image
                      src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${card.image}.webp`}
                      alt={card.title}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <li className="text-base sm:text-lg md:text-xl font-bold text-white whitespace-pre-line text-center">
                    {card.title}
                  </li>
                </motion.div>
              ))}
            </ul>
            <div className="w-full h-fit flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 justify-center items-center text-center mt-4">
              {page.stats?.cards?.map((stat, idx) => (
                <StatCard
                  key={stat.title + idx}
                  animation={
                    idx === 0 ? "left" : idx === 2 ? "right" : "center"
                  }
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

        <div className="w-full h-fit py-20 px-0 bg-transparent">
          <div className="w-[90%] md:w-full max-w-6xl mx-auto flex flex-col gap-12">
            {/* Top Row: Image (moving images) + Text */}
            <div className=" w-full flex flex-col md:flex-row gap-6 bg-mix/10 p-4 rounded-4xl justify-center items-center ">
              {/* Left: Image or video placeholder */}
              <div className="flex-1 flex items-stretch rounded-2xl overflow-hidden min-h-[150px] max-h-[230px] relative bg-blue-200">
                {/* Replace the div below with an animated image carousel or video as needed */}
                <ImageSlider
                  images={[
                    { image: "/banerjee.jpeg", position: "center" },
                    { image: "/futures.cms", position: "center" },
                    { image: "/govtmeet.jpg", position: "center" },
                    { image: "/churchHouse.jpg", position: "center" },
                  ]}
                />
              </div>
              {/* Right: Heading and Paragraph */}
              <div className="flex-1 flex flex-col justify-center py-4 px-4 md:px-8 gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                  Government Relations
                </h1>
                <p className="text-base md:text-lg font-medium text-gray-700 leading-relaxed">
                  We are uniquely connected at every level of both governments.
                  From key officials in state and regional administrations, we
                  ensure your priorities are heard in the right rooms, helping
                  create a more level playing field for businesses.
                </p>
              </div>
            </div>

            {/* Advocacy Intro Paragraph */}
            <div className="w-full flex flex-col gap-2 text-gray-700">
              <p className="text-base md:text-lg font-medium leading-relaxed">
                If your business faces a specific policy or regulatory
                challenge, we help you create the right conversation with the
                government, shape your case, and design the tactical pathway to
                resolve the issue.
              </p>
              <p className="text-base md:text-lg font-semibold leading-relaxed mt-2">
                Our advocacy runs through three core routes:
              </p>
            </div>

            {/* Three core routes in cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Card 1 */}
              <div className="flex flex-col gap-2 bg-mix/10 rounded-2xl shadow-md h-full p-6">
                <h2 className="text-lg md:text-xl font-bold text-navy">
                  1. Ease of Doing Business Working Group
                </h2>
                <p className="text-base md:text-base font-medium leading-relaxed text-gray-800 mt-1">
                  A collective platform where members raise cross-cutting
                  barriers to business, shape reform agendas, and influence
                  policy through structured dialogue with government.
                </p>
              </div>
              {/* Card 2 */}
              <div className="flex flex-col gap-2 bg-mix/10 rounded-2xl shadow-md h-full p-6">
                <h2 className="text-lg md:text-xl font-bold text-navy">
                  2. Sector Advocacy Groups
                </h2>
                <p className="text-base md:text-base font-medium leading-relaxed mb-2 text-gray-800">
                  In priority areas such as:
                </p>
                <ul className="list-disc list-inside ml-2 flex flex-col gap-1 text-base text-gray-700">
                  {[
                    "Data, Telecom and Digital",
                    "Food and Drink",
                    "Higher Education",
                    "Financial Services",
                    "Legal Professional Services",
                    "Sports Betting and Online Gaming",
                    "Aerospace and Defence",
                    "Energy",
                    "Space and Satellites",
                  ].map((item, index) => (
                    <li key={index} className="font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Card 3 */}
              <div className="flex flex-col gap-2 bg-mix/10 rounded-2xl shadow-md h-full p-6">
                <h2 className="text-lg md:text-xl font-bold text-navy">
                  3. Sustainable Development Alliance (SDA)
                </h2>
                <p className="text-base md:text-base font-medium leading-relaxed text-gray-800 mt-1">
                  An initiative that unites UK enterprises, universities, and
                  stakeholders in India to advance the UN Sustainable
                  Development Goals through collaboration and policy dialogue.
                  It showcases responsible industry action, forges cross-sector
                  partnerships, and aligns business innovation with India&apos;s
                  sustainable growth priorities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <Fullscreen
          ref={membershipRef as unknown as React.RefObject<HTMLDivElement>}
          title1={page?.membership?.title || "Membership"}
          title2={page?.membership?.subtitle || "Right place, Right people"}
          description={
            page?.membership?.des ||
            "Join a trusted ecosystem where business, government, and academia meet with intent. As a member, you gain access to curated B2G and B2B forums that turn dialogue into insight and insight into opportunity. Our platform connects you with decision-makers, leading institutions, and growth-ready enterprises to build relationships that deliver long-term value."
          }
          image={
            `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${page?.membership?.image}.webp` ||
            "/home-membership.jpg"
          }
          buttonText={page?.membership?.buttonTxt || "JOIN THE NETWORK"}
          buttonLink={page?.membership?.link || "/membership"}
        /> */}

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
          description={page.contact?.content || ""}
          image={
            `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${page.contact?.image}.webp` ||
            "/connect.webp"
          }
        />
      </section>
    </>
  );
}
