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

export default function Interaction() {
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

  const sectors = [
    {
      name: "Agritech",
      image: "/3-eyes/interaction/agritech.svg",
    },
    {
      name: "Automotive",
      image: "/3-eyes/interaction/automotive.svg",
    },
    // {
    //   name: "Chemicals",
    //   image: "/3-eyes/interaction/chemicals.svg",
    // },
    {
      name: "Aerospace & Defence",
      image: "/3-eyes/interaction/defence.svg",
    },
    {
      name: "AI & Digital Economy",
      image: "/3-eyes/interaction/money.svg",
    },
    {
      name: "Financial and Professional Services",
      image: "/3-eyes/interaction/financial.svg",
    },
    {
      name: "Food & Drink",
      image: "/3-eyes/interaction/food-drink.svg",
    },
    {
      name: "Healthcare & Life Sciences",
      image: "/3-eyes/interaction/healthcare.svg",
    },
    {
      name: "Infrastructure",
      image: "/3-eyes/interaction/infrastructure.svg",
    },
    {
      name: "Legal Services",
      image: "/3-eyes/interaction/legal.svg",
    },
    // {
    //   name: "Life Sciences",
    //   image: "/3-eyes/interaction/life-science.svg",
    // },
    // {
    //   name: "Music",
    //   image: "/3-eyes/interaction/music.svg",
    // },
    // {
    //   name: "Oil & Gas",
    //   image: "/3-eyes/interaction/oil-gass.svg",
    // },
    {
      name: "Renewable Energy",
      image: "/3-eyes/interaction/renewable-energy.svg",
    },
    // {
    //   name: "Leisure & Tourism",
    //   image: "/3-eyes/interaction/tourism.svg",
    // },
    // {
    //   name: "Smart Cities",
    //   image: "/3-eyes/interaction/smart-cities.svg",
    // },
    {
      name: "Higher Education",
      image: "/3-eyes/interaction/education.svg",
    },
    {
      name: "Sports",
      image: "/3-eyes/interaction/sports.svg",
    },

    // {
    //   name: "Trade Bodies and Government Agencies",
    //   image: "/3-eyes/interaction/trade.svg",
    // },
  ];

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

  // const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("http://bryanp25.sg-host.com/wp-json/wp/v2/event?_embed")
      .then((res) => {
        // setEvents(res.data);
        console.log(res.data);
      });
  }, []);

  return (
    <>
      <Lander
        ref={landerRef as unknown as React.RefObject<HTMLDivElement>}
        title_data={[
          {
            title: "Interaction",
            title2: "Dialogue That Moves Markets",
            des: "Deeply embedded across government, industry, and academia, we connect insight to engagement through high-level dialogues, roundtables, delegations, and curated receptions, dinners, and forums. These platforms help you build partnerships that stand out, scale sustainably, and deliver long-term impact across the UK–India corridor.",
          },
        ]}
        flip={true}
        currency={false}
        images={[{ image: "/meeting1.webp", position: "50%_100%" }]}
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
        <section className="w-full pt-20 bg-white text-black">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-navy text-center mb-2">
              Key Sectors
            </h2>
            <p className="md:text-lg text-base text-gray-700 mx-10 md:mx-0 text-center mb-10 max-w-2xl">
              UKIBC supports companies across a wide range of sectors
            </p>
            <div className="mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-3 gap-x-2 md:gap-y-5 md:gap-x-4 justify-items-center w-[96%] sm:w-[90%] max-w-7xl">
              {sectors.map((sector, index) => (
                <motion.div
                  initial={{
                    y: 10,
                    opacity: 0,
                  }}
                  whileInView={{
                    y: 0,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={index}
                  className="flex flex-col hover:scale-105 cursor-pointer text-center bg-navy/5 w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px] rounded-3xl md:rounded-4xl justify-center items-center"
                >
                  <Image
                    src={sector.image as string}
                    alt={sector.name}
                    width={56}
                    height={56}
                    className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-1 p-2 md:p-3"
                  />
                  <span className="text-xs sm:text-sm md:text-base font-bold leading-tight p-2">
                    {sector.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <BoxImageText
          title="The Higher Education Success Blueprint"
          description="India’s higher education landscape is undergoing a structural shift under NEP 2020, opening new pathways for transnational education and global collaboration. To compete in this evolving environment, universities need policy clarity, local intelligence, and last-mile connectivity. <br/><br/>UKIBC enables institutions to navigate change, identify opportunity, and establish a credible presence across India’s education ecosystem. Our Intelligence Unit delivers forward-looking market research, institutional mapping, and policy insight, translating complexity into actionable strategy."
          buttonText="Meet the team"
          buttonLink="/team"
          className="my-20"
          images={[
            // { image: "/noble.jpg", position: "center" },
            { image: "/noble2.jpg", position: "center" },
            { image: "/noble3.jpg", position: "center" },
          ]}
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
          containerClassName="w-full min-h-screen md:h-screen h-[100vh] flex  justify-center items-center bg-navy relative"
        >
          <div
            className="z-10 absolute top-0 left-0 bottom-0 right-0 mx-auto w-full min-h-screen h-auto flex flex-col justify-center items-center text-center gap-12 sm:gap-16 md:gap-20 py-10 sm:py-20 px-4"
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white flex w-[80%] md:w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
              Our intelligence network supports your
            </h1>
            <div className="w-full h-fit flex flex-col sm:flex-row gap-8 sm:gap-10 md:gap-15 justify-center text-center px-0">
              <StatCard
                animation="left"
                number={42}
                valueBefore="£"
                valueAfter=" billion"
                title="International Students worth"
                description="to UK Economy"
                color="white"
              />
              <StatCard
                animation="center"
                number={46000}
                disclaimer="(Last 6 years)"
                title="UKIBC recruited"
                description="students from UKIBC Consortium universities"
                color="white"
              />
              <StatCard
                animation="right"
                title="A total of"
                number={36}
                description="formal UK TNE partnerships were verified, delivered through 58 Indian institutions."
                color="white"
              />
            </div>
          </div>
        </BackgroundGradientAnimation>

        <div className=" hidden w-full h-fit py-20 px-0 bg-transparent">
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-12">
            {/* Top Row: Image (moving images) + Text */}
            <div className=" w-full flex flex-col md:flex-row gap-6 bg-mix/10 p-4 rounded-4xl justify-center items-center ">
              {/* Left: Image or video placeholder */}
              <div className="flex-1 flex items-stretch rounded-2xl overflow-hidden min-h-[150px] max-h-[230px] relative bg-blue-200">
                {/* Replace the div below with an animated image carousel or video as needed */}
                <ImageSlider
                  images={[
                    { image: "/home/eyes/influence-1.png", position: "center" },
                    { image: "/home/eyes/influence-2.png", position: "center" },
                    { image: "/home/eyes/influence-3.png", position: "center" },
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

        <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
          <Carousel
            data={[
              {
                quote:
                  "UKIBC and its expert staff have been instrumental in ensuring that our expansion in India has involved minimal risk, stability, and the ingredients for long-term success.",
                name: "Sian Impey",
                role: "Head of International Development Office, Swansea University",
                image: "/home-person3.jpg",
              },
              {
                quote:
                  "Transnational Education is the beacon illuminating the path to a truly interconnected world, where knowledge transcends borders, cultures unite, and understanding flourishes. Durham University embraces the transformative power of TNE, transcending borders to ignite minds, cultivate global citizenship, and bridge cultures, ensuring knowledge knows no bounds.",
                name: "Professor Kieran Fernandes",
                role: "Durham University",
                image: "/person.jpg",
              },
            ]}
          />
        </div>

        <Fullscreen
          ref={membershipRef as unknown as React.RefObject<HTMLDivElement>}
          title1="Membership"
          title2="The Right Rooms. The Right People."
          description="Join a trusted ecosystem where business, government, and academia meet with intent. As a member, you gain access to curated B2G and B2B forums that turn dialogue into insight and insight into opportunity. Our platform connects you with decision-makers, leading institutions, and growth-ready enterprises to build relationships that deliver long-term value."
          image="/home-membership.jpg"
          buttonText="JOIN THE NETWORK"
          buttonLink="/membership"
        />

        <Connect
          title="Connect with us:"
          description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
          image="/connect.webp"
        />
      </section>
    </>
  );
}
