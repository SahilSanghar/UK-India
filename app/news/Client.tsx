"use client";

import Lander from "@/components/Lander";
import React, { useEffect, useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfoCard from "@/components/InfoCard";
import LandscapeCard from "@/components/LandscapeCard";

const ITEMS_PER_PAGE = 25;

interface PostProps {
  id: string;
  title: string;
  image: string;
  content: string;
  slug: string;
  date: string;
  filters: string[];
  download?: boolean;
  pdfUrl?: string;
}

const FILTERS = [
  { name: "All", team_area: "all", active: true, sort: 5 },
  { name: "Advice", team_area: "advice", active: false, sort: 0 },
  { name: "News", team_area: "news", active: false, sort: 1 },
  { name: "In the Media", team_area: "in-the-media", active: false, sort: 2 },
] as const;

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

export default function News({ page }: { page: PageProps }) {
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [filter, setFilter] = useState<
    { name: string; team_area: string; active: boolean; sort: number }[]
  >([...FILTERS]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["news", "posts"],
    queryFn: async ({ pageParam }) => {
      try {
        const res = await axios.get("/api/admin/posts", {
          params: {
            limit: ITEMS_PER_PAGE,
            lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
          },
        });
        return res.data;
      } catch (error) {
        console.error("Failed to fetch news posts", error);
        throw error; // Still rethrow so query error boundary can handle
      }
    },
    getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
    initialPageParam: undefined as Record<string, unknown> | undefined,
  });

  // Flatten all pages into a single list
  const posts = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.posts ?? []) as PostProps[],
    [data?.pages],
  );

  // Filter posts based on active filter
  const filteredPosts = useMemo(() => {
    const activeFilter = filter.find((f) => f.active);
    if (!activeFilter) return posts;
    if (activeFilter.team_area === "all") return posts;
    return posts.filter((item: PostProps & { filters?: string[] }) =>
      item.filters && Array.isArray(item.filters)
        ? item.filters.includes(activeFilter.team_area)
        : false,
    );
  }, [posts, filter]);

  const loading = isLoading;

  // Show load more button when user scrolls down
  useEffect(() => {
    if (!hasNextPage) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - scrollPosition;
      const scrollPercentage =
        documentHeight > window.innerHeight
          ? (window.scrollY / (documentHeight - window.innerHeight)) * 100
          : 0;

      if ((distanceFromBottom < 300 || scrollPercentage > 50) && hasNextPage) {
        setShowLoadMore(true);
      } else if (distanceFromBottom >= 300 && scrollPercentage <= 50) {
        setShowLoadMore(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, filteredPosts.length]);
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
          <p className="text-4xl font-bold text-navy">News and Insights</p>
          <div className="w-fit h-fit flex flex-row md:gap-4 gap-2 items-center justify-center">
            {filter.map((item) => (
              <div
                key={item.sort}
                className="w-fit h-full flex flex-row items-center justify-center cursor-pointer"
                onClick={() => {
                  setFilter(
                    filter.map((i) =>
                      i.sort === item.sort
                        ? { ...i, active: true }
                        : { ...i, active: false },
                    ),
                  );
                  setShowLoadMore(false);
                }}
              >
                <p
                  className={`text-sm font-bold  md:px-4 px-2 md:py-2 py-1 rounded-full cursor-pointer  duration-300 ${
                    item.active
                      ? "bg-navy border-2 border-navy text-white"
                      : "text-navy bg-white border-2 border-navy"
                  }`}
                >
                  {item.name}
                </p>
              </div>
            ))}
          </div>
          {loading && (
            <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
              <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin "></div>
            </div>
          )}
          <div className="w-fit mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-10  items-center justify-items-center justify-center">
            {filteredPosts.map((item: PostProps, index: number) => {
              return (
                <LandscapeCard
                  title1={item.title}
                  date={item.date}
                  image={
                    item.image
                      ? item.image.replace("ukibc", "ukibc-storage")
                      : "/home-1.png"
                  }
                  link={"/news/" + item.slug}
                  pdfUrl={item.pdfUrl}
                  animation="center"
                  key={index}
                />
              );
            })}
          </div>
          {hasNextPage && (
            <div className="w-full flex items-center justify-center mt-10 mb-10">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className={`px-6 py-3 bg-navy text-white font-bold rounded-full hover:bg-opacity-90 transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${
                  showLoadMore
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-60 translate-y-2 scale-95"
                }`}
              >
                {isFetchingNextPage ? "Loading…" : "Load More"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
