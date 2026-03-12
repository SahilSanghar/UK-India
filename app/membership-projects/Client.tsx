"use client";

import BoxImageText from "@/components/BoxImageText";
import Carousel from "@/components/Carousel";
import Connect from "@/components/Connect";
import Lander from "@/components/Lander";
import React from "react";
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
  testimonials2?: {
    quote: string;
    des: string;
    name: string;
    role: string;
    image: string;
    link: string;
  }[];
  fullscreen?: {
    title: string;
    des: string;
  };
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
  locations?: {
    title: string;
    address: string;
    phone: string;
    email: string;
    src: string;
  }[];
}

export default function MembershipProjects({ page }: { page: PageProps }) {
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

      <section
        id="more"
        className="w-full h-fit flex flex-col items-center justify-center pt-10 md:pt-20"
      >
        <h1 className="md:text-5xl text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-10 text-center w-full px-2">
          {page.box?.[0]?.title}
        </h1>
        <BoxImageText
          description={page.box?.[0]?.content || ""}
          buttonText={page.box?.[0]?.buttonTxt || ""}
          buttonLink={page.box?.[0]?.link || ""}
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
        <div className="md:w-[70%] w-[95%] flex flex-col text-center gap-6 sm:gap-10 mt-10 sm:mt-20 mb-6 sm:mb-10 bg-black/5 rounded-xl px-3 sm:px-10 py-6 sm:py-10">
          <h1 className="text-xl sm:text-2xl font-bold text-black md:w-[50%] w-full sm:w-[90%] mx-auto text-center">
            {page.box?.[1]?.title}
          </h1>
          <div
            className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed text-justify sm:text-center p-5 [&_p]:m-0 [&_p:empty]:h-[1em]"
            dangerouslySetInnerHTML={{
              __html: normalizeRichTextHtml(page.box?.[1]?.content || ""),
            }}
          />
        </div>

        <div className="w-full h-fit flex flex-col gap-6 sm:gap-10 mt-8 sm:mt-10 py-10 sm:py-20 items-center justify-center bg-black/5">
          {/* <h1 className="md:text-4xl md:w-[60%] w-[90%] mx-auto text-3xl font-bold text-black flex text-center justify-center items-center">
            Other advocacy wins and notable advocacy efforts
          </h1> */}

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
        <div className="w-full h-fit flex flex-col items-center justify-center bg-black/5 pb-10 sm:pb-20 ">
          <h1 className="md:text-4xl md:w-[50%] w-full sm:w-[90%] mx-auto text-2xl sm:text-3xl font-bold text-black flex text-center justify-center items-center mb-6 sm:mb-10">
            Other advocacy wins and notable advocacy efforts
          </h1>

          <Carousel
            data={
              Array.isArray(page?.testimonials2)
                ? page.testimonials2.map(
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
      </section>

      <Connect
        title={page.contact?.title || "Connect with us:"}
        description={page.contact?.content || ""}
        image={
          `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${page.contact?.image}.webp` ||
          "/connect.webp"
        }
      />
    </>
  );
}
