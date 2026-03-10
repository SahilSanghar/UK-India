"use client";

import Lander from "@/components/Lander";
import React from "react";
import Person from "@/components/Person";
import Connect from "@/components/Connect";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { normalizeRichTextHtml } from "@/lib/normalizeRichTextHtml";

interface GroupBoardProps {
  title: string;
  id: string;
  job_title: string;
  image: string;
  sort: string;
  content: string;
  address: string;
}

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

export default function GroupBoard({ page }: { page: PageProps }) {
  const { data, isLoading } = useQuery({
    queryKey: ["group-board"],
    queryFn: () =>
      axios.get("/api/admin/group_board").then((res) => res.data.groupBoard),
  });

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

      <div className="w-full h-full flex flex-col justify-center items-center py-20">
        <div
          className="md:text-lg text-base font-medium leading-relaxed xl:w-[50%] md:w-[70%] w-[90%] mx-auto text-justify mb-10 [&_p]:m-0 [&_p:empty]:h-[1em]"
          dangerouslySetInnerHTML={{
            __html: normalizeRichTextHtml(page.fullscreen?.des || ""),
          }}
        />
        <h1 className="md:text-4xl text-2xl text-navy font-bold text-center mb-10">
          Group Board
        </h1>
        <div className="w-[80%] mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-0 gap-y-10  items-start justify-items-start justify-center mx-auto">
          {data
            ?.sort((a: GroupBoardProps, b: GroupBoardProps) => {
              const aSort = a.sort ?? "";
              const bSort = b.sort ?? "";

              if (aSort < bSort) return -1;
              if (aSort > bSort) return 1;
              return 0;
            })
            .map((item: GroupBoardProps, index: number) => (
              <Person
                name={item.title}
                role={item.job_title}
                theme="dark"
                image={
                  item.image
                    ? `https://d2paj8ptqa22jg.cloudfront.net/group-board/${item.id}.webp`
                    : "/person.jpg"
                }
                des1={item.content}
                location={item.address}
                key={index}
              />
            ))}
        </div>
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
    </>
  );
}
