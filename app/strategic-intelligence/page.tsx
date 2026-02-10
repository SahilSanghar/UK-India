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

export default function Influence() {
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
        ref={landerRef as unknown as React.RefObject<HTMLDivElement>}
        title_data={[
          {
            title: "Strategic Intelligence",
            // title2: "Business Growth in India Roadmap",
            // des: "Build High Value Relationships To Last",
          },
        ]}
        flip={true}
        currency={false}
        button={false}
        images={[
          { image: "/home/eyes/influence-1.png", position: "50%_50%" },
          { image: "/home/eyes/influence-2.png", position: "50%_50%" },
          { image: "/home/eyes/influence-3.png", position: "50%_50%" },
        ]}
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
          Our Strategic Intelligence Services
        </p>
        <BoxImageText
          description="Navigating the Indian market can be challenging for UK businesses, yet the UKIBC turns these challenges into opportunities. <br/><br/>

We gather, analyse, and interpret crucial data on market trends, competitors, and industry developments to support strategic decisions that build trust and unlock impact across government, industry, and academia. <br/><br/>
UKIBC experts provide tailored solutions, insights, and guidance to help you make future-focused choices, seize opportunities, and navigate India’s complex landscape with confidence. Our intelligence goes beyond reporting. It acts as the foundation of your market strategy, offering last-mile connectivity. <br/><br/>
We guide you through every insight with pre- and post-engagement consultations. This helps you understand how to apply findings effectively while identifying the right partners and stakeholders across ecosystems. In doing so, we serve as a catalyst for trade, investment, and deeper collaboration, connecting businesses to thrive through ideas, networks, and impact."
          className="my-20"
          images={[{ image: "/growth.jpeg", position: "center" }]}
          flip={false}
        />

        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(1 45 107)"
          gradientBackgroundEnd="rgb(0 11 25)"
          firstColor="3, 107, 252"
          secondColor="2, 87, 207"
          thirdColor="1, 30, 71"
          fourthColor="139, 187, 254"
          fifthColor="139, 187, 254"
          interactive={false}
          containerClassName="w-full min-h-screen 2xl:h-[140vh] xl:h-[150vh] lg:h-[120vh] md:h-[140vh] h-[140vh] flex  justify-center items-center bg-navy relative"
        >
          <div
            className="z-20 absolute top-0 left-0 mx-auto w-full  h-fit flex flex-col justify-center items-center text-center gap-14 md:pt-20  pt-20 "
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="md:text-5xl text-3xl font-bold text-white flex md:w-[40%] w-fit text-center justify-center items-center">
              Our Services
            </h1>
            <ul className="gap-3 justify-items-center items-center place-items-center w-full mt-6">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 justify-center gap-2 ">
                {services.map((service, index) => (
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
                    className="flex flex-col md:gap-2 gap-0 items-center justify-center text-center  w-full "
                  >
                    <div className="p-2 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      {/* search svg */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="md:size-6 size-4 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                    <li className="md:text-xl text-sm font-bold text-white text-center list-none md:w-[60%] w-full">
                      {service.name}
                    </li>
                    <li className="xl:text-base text-[11px] font-bold text-white text-center list-none md:w-[60%] w-[80%]">
                      {service.des}
                    </li>
                  </motion.div>
                ))}
              </div>
              {/* <div className="hidden md:flex col-span-1 md:col-span-3 w-full justify-center mt-5">
                {apps.slice(3).map((app, index) => (
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
                    key={index + 3}
                    className="flex flex-col gap-2 items-center justify-center text-center mx-6"
                  >
                    <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      {app.svg}
                    </div>
                    <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                      {app.name}
                    </li>
                  </motion.div>
                ))}
              </div> */}
              {/* mobile view */}
              {/* <div className="cols-span-1 md:col-span-3 w-full grid grid-cols-2 md:hidden justify-center items-center gap-5">
                {apps.map((app, index) => (
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
                    className="flex flex-col gap-2 items-center justify-center text-center mx-6"
                  >
                    <div className="px-5 py-5 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      {app.svg}
                    </div>
                    <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                      {app.name}
                    </li>
                  </motion.div>
                ))}
              </div> */}
            </ul>
            {/* <div className="w-full  h-fit flex flex-row sm:flex-row gap-6 sm:gap-10 md:gap-15 justify-center text-center ">
              <StatCard
                animation="left"
                number={105}
                description="UKIBC Members"
                color="white"
              />
              <StatCard
                animation="center"
                number={1200}
                description="Attendees in financial year 2024/25"
                color="white"
              />
              <StatCard
                animation="right"
                number={4}
                description="MoUs with State Governments Signed"
                color="white"
              />
            </div> */}
          </div>
        </BackgroundGradientAnimation>

        <BoxImageText
          title="Why Choose Us?"
          description="With our Strategic Intelligence, you will gain a comprehensive understanding of your business environment, empowering you to make data-driven decisions that lead to continuous success. Let us help you navigate complex challenges with precision and confidence. <br/><br/>

UKIBC has created its own in-house measure of India`s economic performance.  Our IMP (India’s Macroeconomic Performance) index draws on several key indicators, including inflation, unemployment rates, and fiscal and trade deficits, to provide an overarching view of India for that month. <br/><br/>

This is an economic barometer of India`s performance and addresses the “trade-off” dilemma by providing insights into the trajectory of India`s economic performance.  Our month-on-month change is reflected in a simple graphic, helping to see the direction of travel. <br/><br/>

For more information on this or for a longer-term view, contact us. "
          className="my-20"
          buttonText="Meet the experts"
          buttonLink="/team?filter=business_solutions"
          images={[{ image: "/meeting.jpg", position: "center" }]}
          flip={true}
        />

        <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
          <Carousel
            data={[
              {
                quote:
                  "We’ve done similar research in other markets. The key is to find a partner who can understand us as a business. We got the sense very early on that UKIBC had that ability. We’re discovering valuable insights into the market.",
                name: "Caroline Newbury",
                role: "Head of International Communications and Business Development, Penguin Random House",
                image: "/home/testimonial/caroline.jpg",
              },
              {
                quote:
                  "The UKIBC set up our subsidiary. They have been managing our India company compliance over the past five years and providing market advice when needed. Our team has tripled as we build valuable business ties.",
                name: "Jonathan Mahoney",
              role: "Biocomposites",
              image: "/home/testimonial/jonathan.jpg",
              },
            ]}
          />
        </div>

        <Connect
          title="Connect with us:"
          description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
          image="/connect.webp"
        />
      </section>
    </>
  );
}
