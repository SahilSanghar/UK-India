"use client";

import Lander from "@/components/Lander";
import React, { useEffect, useState, useMemo } from "react";

import axios from "axios";
import InfoCard from "@/components/InfoCard";

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
  const [filter, setFilter] = useState<
    { name: string; team_area: string; active: boolean; sort: number }[]
  >([
    {
      name: "All",
      team_area: "all",
      active: true,
      sort: 5,
    },
    {
      name: "Advice",
      active: false,
      team_area: "advice",
      sort: 0,
    },
    {
      name: "News",
      team_area: "news",
      active: false,
      sort: 1,
    },
    {
      name: "In the Media",
      team_area: "in-the-media",
      active: false,
      sort: 2,
    },
  ]);
  useEffect(() => {
    axios
      .get(
        "https://bryanp25.sg-host.com/wp-json/wp/v2/posts?_embed&per_page=100"
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

      // Check if post's class_list contains a matching team_area class
      const teamAreaClass = `category-${activeFilter.team_area.replace(
        /_/g,
        "-"
      )}`;
      return item.class_list?.some((className) => className === teamAreaClass);
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
            title: "News and Advice",
            title2:
              "Discover the latest from UKIBC experts, including recent news, expert blogs, key announcements, and updates on government engagements.",

            des: "Access insights and resources to stay informed on UK-India business dynamics. The UK India Business Council (UKIBC) strengthens UK-India trade by offering insights, support, and advocacy. With resources on market entry, policy updates, and expert guidance, UKIBC empowers businesses to thrive in both markets as a trusted partner for growth.",
          },
        ]}
        button={false}
        images={[{ image: "/news.webp", position: "50%_50%" }]}
        flip={true}
      />{" "}
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
                        : { ...i, active: false }
                    )
                  );
                  // Reset pagination when filter changes
                  setCurrentPage(1);
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
            {paginatedPosts.map((item: PostProps, index: number) => {
              return (
                <InfoCard
                  title1={item.title.rendered}
                  date={item.date}
                  image={
                    item.yoast_head_json.og_image?.[0]?.url || "/home-1.png"
                  }
                  link={"/news/" + item.slug}
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
