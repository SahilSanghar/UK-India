"use client";

import Lander from "@/components/Lander";
import React, { useEffect, useState, useMemo } from "react";

import axios from "axios";
import InfoCard from "@/components/InfoCard";
import EventCard from "@/components/EventCard";
import { useInfiniteQuery } from "@tanstack/react-query";

interface PostProps {
  image: string;
  title: string;
  date: string;

  start_date: string;
  end_date: string;
  location: string;
  venue: string;
  who_can_attend: string;
  time: string;
}
export default function Page() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    // isFetchingNextPage,
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

  // Show load more button when user scrolls down

  return (
    <>
      <Lander
        title_data={[
          {
            title: "Events",

            des: "Through our membership, UKIBC can connect firms with other business leaders, engage with governments across the UK and India, and project your business as a leader, at the heart of the UK-India trade and investment relationship.",
          },
        ]}
        button={false}
        images={[{ image: "/event.jpg", position: "50%_50%" }]}
        flip={true}
      />
      <section id="more">
        <div className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20">
          <div className="w-fit mx-auto mt-10 flex flex-col gap-10 items-center justify-items-center justify-center">
            <p className="md:text-4xl text-2xl font-bold text-navy">
              Upcoming Events
            </p>
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
                <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin "></div>
              </div>
            )}
            {data?.pages
              .flatMap((page) => page.events ?? [])
              .filter((item: PostProps) => {
                // item.start_date is in "yyyymmdd" format, e.g., "20250220"
                if (!item.start_date || item.start_date.length !== 8) return false;
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
                          event_end_date={item.end_date}
                          time={item.time}
                        />
                      );
                    }
                  }
                  return null;
                })
            )}
          </div>
          <div className="w-fit  mt-10 flex flex-col  gap-10 items-center justify-items-center justify-center mx-10">
            <p className="md:text-4xl text-2xl font-bold text-navy">
              Past Events
            </p>
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
                <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin "></div>
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
                    event_end_date={item.end_date}
                    time={item.time}
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
