"use client";

import Connect from "@/components/Connect";
import InfoCard from "@/components/InfoCard";
import Lander from "@/components/Lander";
import React from "react";

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
      link: string;
      image: string;
    }[];
  };
}

export default function Projects({ page }: { page: PageProps }) {
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
        className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20"
      >
        <p className="text-4xl font-bold text-navy text-center">Projects</p>
        <div className="w-full h-fit flex md:flex-row flex-col gap-10 items-center justify-center">
          {Array.isArray(page?.cards) &&
            page.cards.map(
              (
                card: {
                  title: string;
                  des: string;
                  image: string;
                  buttonTxt?: string;
                  link?: string;
                },
                idx: number,
              ) => (
                <InfoCard
                  key={idx}
                  animation={idx % 2 === 0 ? "left" : "right"}
                  title1={card.title}
                  des={card.des}
                  image={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${card.image}.webp`}
                  buttonText={"View Projects"}
                  idiot={true}
                  large={true}
                  link={card.link}
                />
              ),
            )}
        </div>
      </section>

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
    </>
  );
}
