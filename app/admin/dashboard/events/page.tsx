"use client";

import React from "react";

import InfoCard from "@/components/InfoCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import EventCard from "@/components/EventCard";

interface EventProps {
  id: number;
  title: string;
  image: string;
  slug: string;
  date: string;
  location: string;
  venue: string;
  who_can_attend: string;
  start_date: string;
  end_date: string;
  time: string;
}

export default function Page() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["events"],
      queryFn: ({ pageParam }) =>
        axios
          .get("/api/admin/events", {
            params: {
              limit: 12,
              lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
            },
          })
          .then((res) => res.data),
      getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
      initialPageParam: undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });

  const events =
    data?.pages.flatMap((page) => page?.events ?? [])?.filter(Boolean) ?? [];

  return (
    <>
      <div className="w-full h-full flex flex-col overflow-x-hidden bg-white pb-10 pt-24">
        <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
          Events
        </h1>
        <p className="text-sm text-center flex items-center justify-center mb-10 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white">
          Total Events: {data?.pages[0].count ?? 0}
        </p>
        <div className="w-fit h-fit flex-col gap-10 justify-center items-center  mx-auto">
          {isLoading ? (
            <>
              <EventCard loading={true} />
              <EventCard loading={true} />
              <EventCard loading={true} />
            </>
          ) : (
            <>
              {events?.map((event: EventProps) => (
                <EventCard
                  className="mb-5"
                  title1={event.title}
                  date={event.date}
                  image={event.image}
                  animation="center"
                  key={event.id}
                  location={event.location}
                  venue={event.venue}
                  who_can_attend={event.who_can_attend}
                  event_date={event.start_date}
                  event_end_date={event.end_date}
                  time={event.time}
                />
              ))}
            </>
          )}
        </div>
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mx-auto mt-10 px-6 py-2 bg-navy text-white rounded-full cursor-pointer"
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    </>
  );
}
