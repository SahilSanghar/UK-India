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

export default function Intelligence() {
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
    {
      name: "Chemicals",
      image: "/3-eyes/interaction/chemicals.svg",
    },
    {
      name: "Defence",
      image: "/3-eyes/interaction/defence.svg",
    },
    {
      name: "Digital Economy",
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
      name: "Healthcare",
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
    {
      name: "Life Sciences",
      image: "/3-eyes/interaction/life-science.svg",
    },
    {
      name: "Music",
      image: "/3-eyes/interaction/music.svg",
    },
    {
      name: "Oil & Gas",
      image: "/3-eyes/interaction/oil-gass.svg",
    },
    {
      name: "Renewable Energy",
      image: "/3-eyes/interaction/renewable-energy.svg",
    },
    {
      name: "Leisure & Tourism",
      image: "/3-eyes/interaction/tourism.svg",
    },
    {
      name: "Smart Cities",
      image: "/3-eyes/interaction/smart-cities.svg",
    },
    {
      name: "Sports",
      image: "/3-eyes/interaction/sports.svg",
    },
    {
      name: "Trade Bodies and Government Agencies",
      image: "/3-eyes/interaction/trade.svg",
    },
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
            title: "Intelligence",
            title2: "Markets, Momentum, Mastery",
            des: "We help you make informed decisions across the UK–India corridor. Our intelligence services combine market research, partner identification, and strategic advisory to support entry, expansion, and scale. We deliver sector-specific research and policy-aware insights, translating complexity into clear, actionable direction so you can move with confidence and reduce risk at every stage.",
          },
        ]}
        flip={true}
        currency={false}
        images={[
          { image: "/home/eyes/intel-1.png", position: "50%_100%" },
          { image: "/home/eyes/intel-2.png", position: "50%_50%" },
          { image: "/home/eyes/intel-3.png", position: "50%_50%" },
          { image: "/home/eyes/intel-4.png", position: "50%_50%" },
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
        <section className="hidden w-full pt-20 bg-white text-black">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-navy text-center mb-2">
              Key Sectors
            </h2>
            <p className="text-lg text-gray-700 text-center mb-10 max-w-2xl">
              UKIBC supports companies across a wide range of sectors
            </p>
            <div className="mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-5 justify-items-center w-[90%] max-w-7xl">
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
                  className="flex flex-col hover:scale-105  cursor-pointer text-center bg-navy/5 w-[180px] rounded-4xl h-[180px] justify-center items-center"
                >
                  <Image
                    src={sector.image as string}
                    alt={sector.name}
                    width={80}
                    height={80}
                    className="w-16 h-16 mb-1 p-3"
                  />
                  <span className="text-base font-bold leading-tight ">
                    {sector.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex gap-5 flex-col my-20">
          <BoxImageText
            title="Strategic Intelligence"
            description="Your business is unique, and so is our approach. At the UKIBC, we focus on understanding the success factors that matter most to you. Our intelligence spans all market entry research areas. We create and curate knowledge, distilling it into actionable insights that fit your exact business needs."
            buttonText="Learn more"
            buttonLink="/strategic-intelligence"
            images={[
              { image: "/strategicIntelligence.jpg", position: "center" },
              { image: "/glassi.jpg", position: "center" },
              { image: "/jet.jpg", position: "center" },
              { image: "/annual.jpg", position: "center" },
            ]}
            flip={false}
          />

          <BoxImageText
            title="Incorporation and Compliance"
            description="We provide end-to-end support, from company registration and business setup to legal, regulatory, and accounting guidance. We also connect you with a trusted network of professional service partners to help you build the right ecosystem from day one."
            buttonText="Business Launchpad"
            buttonLink="/launchpad"
            images={[
              { image: "/comp.webp", position: "center" },
              { image: "/compliance1.jpg", position: "center" },
              { image: "/3-eyes/intel/intel5.jpeg", position: "center" },
            ]}
            flip={true}
          />
        </div>

        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(251 206 188)"
          gradientBackgroundEnd="rgb(241 92 35)"
          firstColor="3, 107, 252"
          secondColor="2, 87, 207"
          thirdColor="1, 30, 71"
          fourthColor="139, 187, 254"
          fifthColor="139, 187, 254"
          interactive={false}
          containerClassName="w-full min-h-screen md:h-screen h-[100vh]  flex  justify-center items-center bg-navy relative"
        >
          <div
            className="z-10 absolute top-0 left-0 mx-auto w-full min-h-screen h-auto flex flex-col justify-center items-center text-center gap-8 md:gap-16 lg:gap-20 py-10 sm:py-20 px-4"
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white flex w-[80%] md:w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
              Our intelligence network supports your
            </h1>
            <div className="w-full h-fit flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-15 justify-center items-center text-center">
              <StatCard
                animation="left"
                number={825}
                valueAfter="+"
                title="Over"
                description="Businesses and universities have used our services"
                color="white"
              />
              <StatCard
                animation="center"
                number={40000}
                title="UKIBC recruited"
                description="students from UKIBC Consortium Universities"
                color="white"
              />
              <StatCard
                animation="right"
                title="Our Members Contribute"
                valueBefore="£"
                number={600}
                valueAfter=" Billion"
                description="of revenue to the worlds economy"
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
                {/* Replace the div below with an <animate>d image carousel or video as needed */}
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
                  "UKIBC provided us with excellent advice and support throughout the recruitment process. Our membership enables us to tap into a network of universities and other UK-focused organisations. This is useful for our broader objectives of engaging with Indian universities and businesses, with whom we seek research collaborations and employment opportunities for our graduates.",
                name: "Richard Cotton",
                role: "Director of Student Recruitment and Outreach, University of Manchester",
                image: "/home/testimonial/richard.jpg",
              },
              {
                quote:
                  "I have nothing but praise for Gunjan’s team. They have been very proactive about delivering what they said they would. I’d highly recommend them. They’re delivering exactly what we asked them to. Their reports are bespoke to us and delivered as promised.",
                name: "Cameron Hunt",
                role: "Anglo American",
                image: "/home/testimonial/hunt.png",
              },
              {
                quote:
                  "The UKIBC set up our subsidiary. They have been managing our India company compliance over the past five years and providing market advice when needed. Our team has tripled as we build valuable business ties",
                name: "Jonathan Mahoney",
                role: "Biocomposites",
                image: "/person.jpg",
              },
            ]}
          />
        </div>
        <div className="w-full h-fit flex flex-col md:flex-row justify-center items-center gap-10 pb-20 bg-black/5">
          <InfoCard
            animation="left"
            title1="Case Studies"
            des="Our intelligence comes to life through rigorous reports grounded in market research and policy insight"
            image="/annual.jpg"
            buttonText="Reports"
            // idiot={true}
            large={true}
            link="/reports"
          />
          <InfoCard
            animation="right"
            title1="Case Studies"
            des="See how our members have successfully entered, expanded, and scaled across the UK–India corridor, offering practical lessons, strategic clarity, and proven pathways for informed decision-making"
            image="/case.webp"
            buttonText="Case Studies"
            // idiot={true}
            large={true}
            link="/business-solution-projects"
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
        {/* <div className="w-full h-fit flex flex-row justify-center items-center">
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-navy">
              Connect with us:
            </h1>
            <p className="text-lg font-medium leading-relaxed w-[60%] m-auto text-justify">
              To connect with one of our India Experts simply email us or send
              us a message via our contact page. We look forward to connecting
              with you.
            </p>
            <LiquidButton text="Contact Us" link="/contact" />
          </div>
          <div className="w-full h-screen max-w-6xl bg-red-200 mx-auto flex flex-col gap-8 items-center justify-center text-center">
            <Image
              src="/home-card1.png"
              alt="influence"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </div>
        </div> */}
      </section>
    </>
  );
}
