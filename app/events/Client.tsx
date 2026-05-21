"use client";

import Lander from "@/components/Lander";
import React, { useState } from "react";
import axios from "axios";
import EventCard from "@/components/EventCard";
import { useQuery } from "@tanstack/react-query";

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

const EVENTS_PER_PAGE = 5;

export default function Events({ page }: { page: PageProps }) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch ALL events once, filter client-side
  const { data, isLoading } = useQuery({
    queryKey: ["events-all"],
    queryFn: () =>
      axios
        .get("/api/admin/events", {
          params: { limit: 1000 },
        })
        .then((res) => res.data),
  });

  const allEvents: PostProps[] = data?.events ?? [];

  const now = new Date();
  const nowNum =
    now.getFullYear() * 10000 +
    (now.getMonth() + 1) * 100 +
    now.getDate();

  const upcomingEvents = allEvents.filter((item) => {
    if (!item.start_date || item.start_date.length !== 8) return false;
    return Number(item.start_date) >= nowNum;
  });

  const pastEvents = allEvents
    .filter((item) => {
      if (!item.start_date || item.start_date.length !== 8) return false;
      return Number(item.start_date) < nowNum;
    })
    .reverse(); // most recent past events first

  const activeEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  const totalPages = Math.ceil(activeEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = activeEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE,
  );

  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    setCurrentPage(1); // reset to page 1 on tab switch
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // scroll to top of events section
    document.getElementById("more")?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

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
            : [{ image: "/person.jpg", position: "50%_50%" }]
        }
      />
      <section id="more">
        <div className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20">

          {/* Tabs */}
          <div className="flex gap-2 bg-navy/5 p-1 rounded-full">
            <button
              onClick={() => handleTabChange("upcoming")}
              className={`px-6 py-2 rounded-full font-bold text-base transition-all duration-300 cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-navy text-white"
                  : "text-navy hover:bg-navy/10"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => handleTabChange("past")}
              className={`px-6 py-2 rounded-full font-bold text-base transition-all duration-300 cursor-pointer ${
                activeTab === "past"
                  ? "bg-navy text-white"
                  : "text-navy hover:bg-navy/10"
              }`}
            >
              Past Events
            </button>
          </div>

          {/* Events List */}
          <div className="w-fit mx-auto flex flex-col gap-10 items-center justify-items-center justify-center md:max-w-[800px] w-full">
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
                <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {!isLoading && activeEvents.length === 0 && (
              <p className="text-gray-500 text-lg font-medium">
                {activeTab === "upcoming"
                  ? "There are no upcoming events"
                  : "There are no past events"}
              </p>
            )}

            {paginatedEvents.map((item: PostProps, index: number) => (
              <EventCard
                key={index}
                title1={item.title}
                date={item.date}
                image={item.image || "/home-1.png"}
                animation="center"
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
            ))}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
              {/* Prev */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed bg-navy/10 text-navy"
                    : "bg-navy/10 text-navy hover:bg-navy hover:text-white"
                }`}
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-navy font-bold">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${
                      currentPage === p
                        ? "bg-navy text-white"
                        : "bg-navy/10 text-navy hover:bg-navy hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed bg-navy/10 text-navy"
                    : "bg-navy/10 text-navy hover:bg-navy hover:text-white"
                }`}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}