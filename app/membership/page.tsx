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
import TeamCard from "@/components/Team";
import Person from "@/components/Person";

export default function Membership() {
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

  const [filter, setFilter] = useState<
    { name: string; active: boolean; sort: number }[]
  >([
    {
      name: "Executive Leadership Team",
      active: true,
      sort: 0,
    },
    {
      name: "Business Solutions",
      active: false,
      sort: 1,
    },
    {
      name: "Membership and Advocacy",
      active: false,
      sort: 2,
    },
    {
      name: "Business Operations",
      active: false,
      sort: 3,
    },
    {
      name: "Events",
      active: false,
      sort: 4,
    },
    {
      name: "All",
      active: false,
      sort: 5,
    },
  ]);

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
            title: "Why Become a UKIBC Member?",
            title2:
              "Dialogue, Decisions, Development - Networks That Deliver Growth",

            // title2: "Shaping the Conversations That Shape Policy",
            des: "Through curated events and member-only Sector Policy Groups, we help you meet the right people, uncover new opportunities and learn from senior leaders across business and policy. Become part of a network designed to deliver impact.",
          },
        ]}
        button={false}
        flip={true}
        currency={false}
        buttonLink="#more"
        images={[
          { image: "/home/lander/4.webp", position: "bottom-right" },
          { image: "/home/lander/1.webp", position: "50%_100%" },
          { image: "/home/lander/2.webp", position: "50%_50%" },
          { image: "/home/lander/3.webp", position: "10%_10%" },
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
        <p className="xl:text-4xl md:text-3xl text-2xl text-navy font-bold text-center md:w-[50%] w-[90%] mx-auto mt-20">
          Choose the membership level that best supports your UK–India goals.
        </p>
        <BoxImageText
          title="Corporate"
          description="Corporate membership gives you access to our core pillars: Influence, Interact and Intelligence. You join our Ease of Doing Business Working Group, sector groups and key B2G forums, with entry to UKIBC events across the UK and India. This level connects you to our trusted networks across government, industry and academia and keeps you ahead with future-focused insight."
          // buttonText="Enquire"
          className="mt-20"
          // buttonLink="/contact"
  
          images={[
            { image: "/corpo1.jpeg", position: "center" },
            { image: "/corpo2.jpeg", position: "center" },
            { image: "/corpo3.jpeg", position: "center" },
          ]}
          flip={false}
        />
      <BoxImageText
          title="Corporate Plus"
          description="Corporate Plus offers higher dedicated support and deeper access. You gain entry to exclusive leadership dinners and roundtables in both countries, plus priority visibility at major UKIBC conferences on themes like technology, sustainability and university-industry partnerships. This tier strengthens your profile and expands last-mile connectivity with high-level stakeholders."
          // buttonText="Enquire"
          className="mt-5"
          // buttonLink="/contact"
          flip={true}
          images={[
            { image: "/home/who-we-are/1.webp", position: "center" },
            { image: "/home/who-we-are/3.webp", position: "center" },
          ]}
        />
        <BoxImageText
          title="Strategic Partner"
          description="Strategic Partners receive a fully tailored partnership built around their individual goals. We work closely with you on bespoke engagement, from targeted B2G connections to one-on-one meetings with senior officials. This tier positions your organisation as a trusted leader in the UK–India corridor and acts as a catalyst for collaboration, trade and long-term impact."
          // buttonText="Enquire"
          className="mt-5 mb-20"
          // buttonLink="/contact"
          flip={false}
          images={[
            { image: "/govtmeet.jpg", position: "center" },
            { image: "/home-2.jpeg", position: "center" },
            // { image: "/home/eyes/influence-3.png", position: "center" },
          ]}
        />

        {/* <BackgroundGradientAnimation
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
            className=" z-10 absolute top-0 left-0 mx-auto w-full h-screen flex flex-col justify-center items-center text-center gap-20 py-30 "
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="text-5xl font-bold text-white flex   w-[40%]">
              Our intelligence network supports your
            </h1>
            <ul className="flex gap-10">
              {[
                "Business Operations",
                "Government Relations",
                "Advocacy Support",
              ].map((item, index) => {
                return (
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
                    className="flex flex-col gap-2 items-center justify-center"
                  >
                    {index === 0 ? (
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-10 text-white "
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                            clipRule="evenodd"
                          />
                          <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                        </svg>
                      </div>
                    ) : index === 1 ? (
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-10 text-white "
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 9.152 1 .75.75 0 0 1-.152 1.485h-1.918l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 18.75 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 0 1-.262 1.453h-8.37a.75.75 0 0 1-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 5.25 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84L4.168 6.241H2.25a.75.75 0 0 1-.152-1.485 49.105 49.105 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75Zm4.878 13.543 1.872-7.662 1.872 7.662h-3.744Zm-9.756 0L5.25 8.131l-1.872 7.662h3.744Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-10 text-white "
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                            clipRule="evenodd"
                          />
                          <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                        </svg>
                      </div>
                    )}
                    <li key={index} className="text-xl font-bold text-white">
                      {item}
                    </li>
                  </motion.div>
                );
              })}
            </ul>
            <div className="w-full  h-fit flex flex-row sm:flex-row gap-6 sm:gap-10 md:gap-15 justify-center text-center ">
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
            </div>
          </div>
        </BackgroundGradientAnimation> */}
        {/* 
        <Fullscreen
          ref={membershipRef as unknown as React.RefObject<HTMLDivElement>}
          title1="Membership"
          title2="The Right Rooms. The Right People."
          description="Join a trusted ecosystem where business, government, and academia meet with intent. As a member, you gain access to curated B2G and B2B forums that turn dialogue into insight and insight into opportunity. Our platform connects you with decision-makers, leading institutions, and growth-ready enterprises to build relationships that deliver long-term value."
          image="/home-membership.jpg"
          buttonText="JOIN THE NETWORK"
          buttonLink="/membership"
        /> */}
        <Connect
          title="Enquiries"
          description="To find out more about UKIBC, speak to one of our experts. Gain instant access to a network of businesses and organisations across sectors such as Digital, Food and Drink, Legal and Professional Services, and Higher Education."
          image="/connect.webp"
        />
        <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
          <Carousel
            data={[
              {
                quote:
                  "The UKIBC is important as the UK relationship with India has to be right at a political level and the economic level. This organisation brings both of these things together. It enables us to have a good dialogue, and much more. The opportunities are enormous in both countries.",
                name: "Lord Edward Udny Lister",
                role: "Former HSBC",
                image: "/home/testimonial/lord.webp",
              },
              {
                quote:
                  "UKIBC is doing the right thing by trying to understand what its members really want so they can fulfil those expectations. So, I think it is a good initiative.",
                name: "Archana Venkat",
                role: "Trilegal",
                image: "/home/testimonial/archana.webp",
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
