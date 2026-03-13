"use client";
import React from "react";
import Lander from "@/components/Lander";
import BoxImageText from "@/components/BoxImageText";
import Connect from "@/components/Connect";
import Carousel from "@/components/Carousel";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import LiquidButton from "@/components/LiquidButton";
import { data } from "framer-motion/client";
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
  fullscreen?: {
    title: string;
    des: string;
    cards: {
      title: string;
      image: string;
    }[];
  };
  fullscreen2?: {
    title: string;
    des: string;
    cards: {
      title: string;
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

export default function GovernmentRelations({ page }: { page: PageProps }) {
  const news = [
    {
      title: "UK qualifications recognised in India’s draft education policy",
      link: "/news/uk-and-india-agree-to-mutual-recognition-of-qualifications",
    },
    {
      title: "Insurance FDI cap raised from 49% to 74%",
      link: "/news/government-of-india-raises-fdi-limit-in-defence-manufacturing",
    },
    {
      title: "Law Commission support for legalising sports betting",
      link: "/reports/gaming-for-growth-indias-sports-and-gaming-market-potential",
    },
    {
      title: "Two-year UK post-study work visa reinstated",
      link: "/news/ukibc-welcomes-opening-of-new-uk-graduate-immigration-route/",
    },
    {
      title: "Flexible food labelling regulations introduced",
      link: "/news/advocacy-win-extension-of-implementation-date-of-food-safety-and-standards-labelling-and-display-regulation/",
    },
    {
      title:
        "Corporate tax on foreign company branches reduced from 43.68% to 35%",
      link: "/news/ukibc-welcomes-indian-corporate-tax-rate-reduction/",
    },
  ];
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
      <BoxImageText
        title={page.box?.[0]?.title || ""}
        description={page.box?.[0]?.content || ""}
        buttonText={page.box?.[0]?.buttonTxt || ""}
        buttonLink={page.box?.[0]?.link || ""}
        className="mt-10"
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
      <BoxImageText
        title={page.box?.[1]?.title || ""}
        description={page.box?.[1]?.content || ""}
        buttonText={page.box?.[1]?.buttonTxt || ""}
        buttonLink={page.box?.[1]?.link || ""}
        className="mt-10"
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
      <BoxImageText
        title={page.box?.[2]?.title || ""}
        description={page.box?.[2]?.content || ""}
        buttonText={page.box?.[2]?.buttonTxt || ""}
        buttonLink={page.box?.[2]?.link || ""}
        className="my-10"
        images={
          page.box?.[2]?.image && page.box[2].image.length > 0
            ? page.box[2].image.map((image: string) => ({
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
        gradientBackgroundStart="rgb(1 45 107)"
        gradientBackgroundEnd="rgb(0 11 25)"
        firstColor="3, 107, 252"
        secondColor="2, 87, 207"
        thirdColor="1, 30, 71"
        fourthColor="139, 187, 254"
        fifthColor="139, 187, 254"
        interactive={false}
        containerClassName="w-full min-h-[1200px] md:min-h-screen  h-[200vh]  flex  justify-center items-center bg-navy relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="z-10 absolute top-0 left-0 mx-auto w-full min-h-screen h-full flex flex-col justify-center items-center text-center py-16 px-4 sm:px-6 gap-10 sm:gap-16 justify-center items-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="text-2xl xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl font-bold text-white flex w-full justify-center items-center text-center mx-auto"
          >
            <span className="w-full text-center md:w-[40%] mx-auto">{page.fullscreen?.title}</span>
          </motion.h1>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
            className="flex flex-col sm:flex-col  justify-center items-center w-full"
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.99 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: false }}
              className="flex flex-col gap-2 items-center justify-center w-full sm:w-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: false }}
                className="text-base sm:text-base md:text-base font-medium text-white whitespace-pre-line text-center w-[100%] mx-auto [&_a]:text-white [&_a]:underline gap-1 flex flex-col
                  [&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-2 [&_li:last-child]:mb-0 [&_li]:pl-1"
                dangerouslySetInnerHTML={{ __html: page.fullscreen?.des || "" }}
              />
            </motion.div>
          </motion.ul>

          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-2xl xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl font-bold text-white flex w-full justify-center items-center text-center mx-auto"
          >
            <span className="w-full text-center md:w-[40%] mx-auto">
              {page.fullscreen2?.title}
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            viewport={{ once: false }}
            className="text-base sm:text-base md:text-base font-medium text-white whitespace-pre-line text-center w-[80%] sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-[50%] mx-auto"
            dangerouslySetInnerHTML={{ __html: normalizeRichTextHtml(page.fullscreen2?.des || "") }}
          />

          {/* <LiquidButton text="Membership" link="/membership" /> */}
        </motion.div>
      </BackgroundGradientAnimation>

      <Connect
        title={page.contact?.title || "Connect with us:"}
        description={page.contact?.content || ""}
        image={
          `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${page.contact?.image}.webp` ||
          "/connect.webp"
        }
      />

      <div className="py-20 bg-black/5">
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
    </>
  );
}
