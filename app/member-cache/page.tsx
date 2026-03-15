"use client";

import Lander from "@/components/Lander";
import React, { useEffect, useState, useMemo } from "react";

import axios from "axios";
import LandscapeCard from "@/components/LandscapeCard";

interface PostProps {
  yoast_head_json: {
    og_image: { url: string }[];
  };
  title: { rendered: string };
  date: string;
  content: { rendered: string };
  slug: string;
  class_list: string[];
}
export default function Page() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const itemsPerPage = 10;
  // Dynamically build a year-based filter from posts
  const [filter, setFilter] = useState<
    { name: string; team_area: string; active: boolean; sort: number }[]
  >([
    {
      name: "All",
      team_area: "all",
      active: true,
      sort: 0,
    },
  ]);

  // Update filter when posts are fetched
  useEffect(() => {
    if (!posts.length) return;

    // Get up to max 5 most recent years from posts
    const years = Array.from(
      new Set(
        posts
          .map((post) => (post.date ? post.date.slice(0, 4) : null))
          .filter((y): y is string => !!y)
      )
    )
      .sort((a, b) => Number(b) - Number(a))
      .slice(0, 5);

    const filters = [
      {
        name: "All",
        team_area: "all",
        active:
          filter.find((f) => f.active)?.team_area === "all" ? true : false,
        sort: 0,
      },
      ...years.map((year, idx) => ({
        name: year,
        team_area: year,
        active: filter.find((f) => f.active)?.team_area === year ? true : false,
        sort: idx + 1,
      })),
    ];

    // Ensure one is active
    const activeFound = filters.some((f) => f.active);
    if (!activeFound && filters.length) {
      filters[0].active = true;
    }

    setFilter(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);
  useEffect(() => {
    axios
      .get(
        "https://bryanp25.sg-host.com/wp-json/wp/v2/project?_embed&per_page=100"
      )
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
        console.log(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Filter posts based on active filter
  const filteredPosts = useMemo(() => {
    return posts.filter((item: PostProps) => {
      const activeFilter = filter.find((f) => f.active);
      if (!activeFilter) return true;

      // If filter is "all", show all posts
      if (activeFilter.team_area === "all") {
        return true;
      }

      // Filter by year: compare item's date year with the active filter's team_area (which is a year)
      const postYear = item.date ? item.date.slice(0, 4) : "";
      return postYear === activeFilter.team_area;
    });
  }, [posts, filter]);

  // Get paginated posts
  const paginatedPosts = useMemo(() => {
    return filteredPosts.slice(0, currentPage * itemsPerPage);
  }, [filteredPosts, currentPage]);

  const hasMore = filteredPosts.length > currentPage * itemsPerPage;

  // Show load more button when user scrolls down
  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      // Show button when user is near bottom (within 300px) or has scrolled past 50% of page
      const distanceFromBottom = documentHeight - scrollPosition;
      const scrollPercentage =
        (window.scrollY / (documentHeight - window.innerHeight)) * 100;

      if ((distanceFromBottom < 300 || scrollPercentage > 50) && hasMore) {
        setShowLoadMore(true);
      } else if (distanceFromBottom >= 300 && scrollPercentage <= 50) {
        setShowLoadMore(false);
      }
    };

    // Check on mount and after content changes
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, paginatedPosts.length]);
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Business Solution Projects",

            des: "The UK India Business Council (UKIBC) team is committed to enhancing the trade and investment relationship between the UK and India, fostering a vibrant and equitable economic partnership that creates jobs and prosperity in both nations while serving as a force for global good.",
          },
        ]}
        flip={true}
        currency={false}
        buttonTxt="Know more"
        buttonLink="#more"
        images={[{ image: "/case.webp", position: "50%_50%" }]}
      />
      <section id="more">
        <div className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20">
          <p className="text-4xl font-bold text-navy">Reports</p>
          <div className="w-fit h-fit flex flex-row gap-4 items-center justify-center">
            {filter.map((item) => (
              <div
                key={item.sort}
                className="w-fit h-full flex flex-row items-center justify-center cursor-pointer"
                onClick={() => {
                  setFilter(
                    filter.map((i) =>
                      i.sort === item.sort
                        ? { ...i, active: true }
                        : { ...i, active: false }
                    )
                  );
                  // Reset pagination when filter changes
                  setCurrentPage(1);
                  setShowLoadMore(false);
                }}
              >
                <p
                  className={`text-sm font-bold  px-4 py-2 rounded-full cursor-pointer  duration-300 ${
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
            {paginatedPosts.map((item: PostProps, index: number) => {
              return (
                <LandscapeCard
                  title1={item.title.rendered}
                  date={item.date}
                  landscape={true}
                  image={
                    item.yoast_head_json.og_image?.[0]?.url || "/home-1.png"
                  }
                  link={"/business-solution-projects/" + item.slug}
                  animation="center"
                  key={index}
                />
              );
            })}
          </div>
          {hasMore && (
            <div className="w-full flex items-center justify-center mt-10 mb-10">
              <button
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                }}
                className={`px-6 py-3 bg-navy text-white font-bold rounded-full hover:bg-opacity-90 transition-all duration-300 cursor-pointer ${
                  showLoadMore
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-60 translate-y-2 scale-95"
                }`}
              >
                Load More ({filteredPosts.length - paginatedPosts.length}{" "}
                remaining)
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

{
  /* <Lander
        title_data={[
          {
            title: "Business Solution Projects",

            des: "The UK India Business Council (UKIBC) team is committed to enhancing the trade and investment relationship between the UK and India, fostering a vibrant and equitable economic partnership that creates jobs and prosperity in both nations while serving as a force for global good.",
          },
        ]}
        flip={true}
        currency={false}
        buttonTxt="Know more"
        buttonLink="#more"
        images={[{ image: "/case.webp", position: "50%_50%" }]}
      /> */
}
