"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import BoxImageText from "@/components/BoxImageText";
import { useSetNavbar } from "@/lib/navbar-context";
import { motion } from "framer-motion";
import Carousel from "@/components/Carousel";
import Lander from "@/components/Lander";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Connect from "@/components/Connect";
import Image from "next/image";
import LogoMarquee from "@/components/LogoMarquee";

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
  fullscreen2?: {
    title: string;
    des: string;
    cards: {
      title: string;
      buttonTxt: string;
      link: string;
      image: string;
    }[];
  };
  fullscreen3?: {
    title: string;
    des: string;
    cards: {
      title: string;
      buttonTxt: string;
      link: string;
      image: string;
    }[];
  };
  fullscreen4?: {
    title: string;
    des: string;
    cards: {
      title: string;
      buttonTxt: string;
      link: string;
      image: string;
    }[];
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

export default function Launchpad({ page }: { page: PageProps }) {
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
            : [
                {
                  image: "/person.jpg",
                  position: "50%_50%",
                },
              ]
        }
      />
      <LogoMarquee />
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
          {page.box?.[0]?.title || ""}
        </p>
        <BoxImageText
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

        <section id="services">
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
            <div
              className=" z-10 absolute top-0 left-0 mx-auto w-full md:h-screen h-[150vh] flex flex-col justify-center items-center text-center gap-20 py-30 "
              ref={
                intelligenceRef as unknown as React.RefObject<HTMLDivElement>
              }
            >
              <h1 className="md:text-5xl text-3xl font-bold text-white flex md:w-[40%] w-fit text-center mx-auto justify-center items-center">
                {page.fullscreen?.title}
              </h1>
              <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center justify-center w-full">
                <div className="hidden md:flex col-span-1 md:col-span-3 w-fit items-center justify-center">
                  {page.fullscreen?.cards.slice(0, 3).map((app, index) => (
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
                      onClick={() =>
                        app.link && window.open(app.link, "_blank")
                      }
                    >
                      <div className="p-5 w-20 bg-tiger rounded-full flex items-center justify-center mx-auto">
                        <Image
                          src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${app.image}.webp`}
                          alt={app.title}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                        {app.title}
                      </li>
                    </motion.div>
                  ))}
                </div>
                <div className="hidden md:flex col-span-1 md:col-span-3 w-full justify-center mt-5">
                  {page.fullscreen?.cards.slice(3).map((app, index) => (
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
                      onClick={() =>
                        app.link && window.open(app.link, "_blank")
                      }
                    >
                      <div className="p-5 w-20 bg-tiger rounded-full flex items-center justify-center mx-auto">
                        <Image
                          src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${app.image}.webp`}
                          alt={app.title}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                        {app.title}
                      </li>
                    </motion.div>
                  ))}
                </div>
                {/* mobile view */}
                <div className="cols-span-1 md:col-span-3 w-full grid grid-cols-2 md:hidden justify-center items-center gap-5">
                  {page.fullscreen?.cards.map((app, index) => (
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
                      onClick={() =>
                        app.link && window.open(app.link, "_blank")
                      }
                    >
                      <div className="p-5 w-20 bg-tiger rounded-full flex items-center justify-center mx-auto">
                        <Image
                          src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${app.image}.webp`}
                          alt={app.title}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                        {app.title}
                      </li>
                    </motion.div>
                  ))}
                </div>
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
        </section>

        <BoxImageText
          title={page.box?.[1]?.title || ""}
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
          flip={false}
        />

        <div className="w-full h-fit min-h-screen  flex  justify-center items-center bg-navy bg-gradient-to-b from-navy to-black/50">
          <div
            className=" z-10 top-0 left-0 mx-auto w-full  flex flex-col justify-center items-center text-center gap-20 py-30 "
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="md:text-4xl text-xl font-bold text-white flex  md:w-[60%] w-[90%] ">
              {page.fullscreen2?.title}
            </h1>
            <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center place-items-center w-full">
              <div className="cols-span-1 md:col-span-3 md:w-[70%] w-[90%] grid md:grid-cols-3  grid-cols-2 justify-center items-center gap-5">
                {page.fullscreen2?.cards.map((app, index) => (
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
                    className="flex flex-col h-full gap-2 items-center  text-center md:mx-6 mx-2 "
                    onClick={() => app.link && window.open(app.link, "_blank")}
                  >
                    <div className="p-5 w-20 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      <Image
                        src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${app.image}.webp`}
                        alt={app.title}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <li className="md:text-lg text-[12px] font-bold text-white text-center list-none xl:w-[90%] w-full">
                      {app.title}
                    </li>
                  </motion.div>
                ))}
              </div>
            </ul>
            <h1
              className="md:text-2xl flex-col text-sm font-bold text-white flex  md:w-[60%] w-[90%] "
              dangerouslySetInnerHTML={{ __html: page.fullscreen2?.des || "" }}
            ></h1>
            <h1 className="md:text-4xl text-xl font-bold text-white flex text-center justify-center items-center  md:w-[60%] w-[90%] ">
              {page.fullscreen3?.title}
            </h1>
            <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center place-items-center w-full">
              <div className="cols-span-1 md:col-span-3 md:w-[70%] w-[90%] grid md:grid-cols-3  grid-cols-2 justify-center items-center gap-5">
                {page.fullscreen3?.cards.map((app, index) => (
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
                    className="flex flex-col h-full gap-2 items-center  text-center md:mx-6 mx-2 "
                    onClick={() => app.link && window.open(app.link, "_blank")}
                  >
                    <div className="p-5 w-20 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      <Image
                        src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${app.image}.webp`}
                        alt={app.title}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <li className="md:text-lg text-[12px] font-bold text-white text-center list-none xl:w-[90%] w-full">
                      {app.title}
                    </li>
                  </motion.div>
                ))}
              </div>
            </ul>

            <h1 className="md:text-4xl text-xl font-bold text-white flex text-center justify-center items-center  md:w-[60%] w-[90%] ">
              {page.fullscreen4?.title}
            </h1>
            <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center place-items-center w-full">
              <div className="cols-span-1 md:col-span-3 md:w-[70%] w-[90%] grid md:grid-cols-3  grid-cols-2 justify-center items-center gap-5">
                {page.fullscreen4?.cards.map((app, index) => (
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
                    className="flex flex-col h-full gap-2 items-center  text-center md:mx-6 mx-2 "
                    onClick={() => app.link && window.open(app.link, "_blank")}
                  >
                    <div className="p-5 w-20 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      <Image
                        src={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${app.image}.webp`}
                        alt={app.title}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <li className="md:text-lg text-[12px] font-bold text-white text-center list-none xl:w-[90%] w-full">
                      {app.title}
                    </li>
                  </motion.div>
                ))}
              </div>
            </ul>

            <h1
              className="md:text-2xl flex-col text-sm font-bold text-white flex text-center justify-center items-center  md:w-[60%] w-[90%] "
              dangerouslySetInnerHTML={{ __html: page.fullscreen4?.des || "" }}
            ></h1>
          </div>
        </div>

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
