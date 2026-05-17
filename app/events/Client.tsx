"use client";

import Lander from "@/components/Lander";
import React, { useEffect, useState, useMemo } from "react";

import axios from "axios";
import InfoCard from "@/components/InfoCard";
import EventCard from "@/components/EventCard";
import { useInfiniteQuery } from "@tanstack/react-query";

interface PostProps {
  id: string;
  image: string;
  title: string;
  date: string;
  tempdate: string;
  start_date: string;
  end_date: string;
  location: string;
  venue: string;
  who_can_attend: string;
  time: string;
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

export default function Events({ page }: { page: PageProps }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["events"],
    queryFn: ({ pageParam }) =>
      axios
        .get("/api/admin/events", {
          params: {
            limit: 10,
            lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
          },
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
    initialPageParam: undefined as Record<string, unknown> | undefined,
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
      <section id="more">
        <div className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20">

          {/* Upcoming Events */}
          <div className="w-fit mx-auto mt-10 flex flex-col gap-10 items-center justify-items-center justify-center md:max-w-[800px] w-full">
            <p className="md:text-4xl text-2xl font-bold text-navy">
              Upcoming Events
            </p>
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
                <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {data?.pages
              .flatMap((page) => page.events ?? [])
              .filter((item: PostProps) => {
                if (!item.start_date || item.start_date.length !== 8)
                  return false;
                const eventDateNum = Number(item.start_date);
                const now = new Date();
                const nowNum =
                  now.getFullYear() * 10000 +
                  (now.getMonth() + 1) * 100 +
                  now.getDate();
                return eventDateNum > nowNum;
              }).length === 0 && !isLoading ? (
              <p className="text-gray-500 text-lg font-medium">
                There are no events yet
              </p>
            ) : (
              data?.pages
                .flatMap((page) => page.events ?? [])
                .map((item: PostProps, index: number) => {
                  if (item.start_date && item.start_date.length === 8) {
                    const eventDateNum = Number(item.start_date);
                    const now = new Date();
                    const nowNum =
                      now.getFullYear() * 10000 +
                      (now.getMonth() + 1) * 100 +
                      now.getDate();
                    if (eventDateNum > nowNum) {
                      return (
                        <EventCard
                          title1={item.title}
                          date={item.date}
                          image={item.image || "/home-1.png"}
                          animation="center"
                          key={index}
                          location={item.location}
                          venue={item.venue}
                          who_can_attend={item.who_can_attend}
                          event_date={item.start_date}
                          tempdate={item.tempdate || ""}
                          event_end_date={item.end_date}
                          time={item.time}
                          className="w-full max-w-[800px]"
                          link={`/events/${item.id}`}
                        />
                      );
                    }
                  }
                  return null;
                })
            )}
          </div>

          {/* Other Events */}
          <div className="w-fit mt-10 flex flex-col gap-10 items-center justify-items-center justify-center mx-10">
            <p className="md:text-4xl text-2xl font-bold text-navy">
              Other Events
            </p>
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
                <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {data?.pages
              .flatMap((page) => page.events ?? [])
              .map((item: PostProps, index: number) => {
                return (
                  <EventCard
                    title1={item.title}
                    date={item.date}
                    image={item.image || "/home-1.png"}
                    animation="center"
                    key={index}
                    location={item.location}
                    venue={item.venue}
                    who_can_attend={item.who_can_attend}
                    event_date={item.start_date}
                    tempdate={item.tempdate || ""}
                    event_end_date={item.end_date}
                    time={item.time}
                    link={`/events/${item.id}`}
                  />
                );
              })}
          </div>

          {hasNextPage && (
            <div className="w-full flex items-center justify-center mt-10 mb-10">
              <button
                onClick={() => {
                  fetchNextPage();
                }}
                className={`px-6 py-3 bg-navy text-white font-bold rounded-full hover:bg-opacity-90 transition-all duration-300 cursor-pointer ${
                  !isFetching
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-60 translate-y-2 scale-95"
                }`}
              >
                Load More (
                {data?.pages[0]?.count
                  ? data?.pages[0]?.count -
                    (data?.pages.flatMap((page) => page.events ?? []).length ??
                      0)
                  : 0}{" "}
                remaining)
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}