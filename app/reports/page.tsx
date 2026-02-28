"use client";

import Lander from "@/components/Lander";
import React, { useEffect, useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { getSession } from "@/lib/session";
import LandscapeCard from "@/components/LandscapeCard";

interface PostProps {
  image: string;
  title: string;
  date: string;
  slug: string;
}

const fetchReports = async ({
  pageParam = null,
}: {
  pageParam?: string | null;
}): Promise<{
  reports: PostProps[];
  lastKey: string | null;
  count: number;
}> => {
  const res = await axios.get("/api/admin/reports", {
    params: {
      limit: 10,
      lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
    },
  });
  return res.data;
};

export default function Page() {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PostProps[] | null>(null);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["reports"],
      queryFn: fetchReports,
      getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
      initialPageParam: undefined,
    });

  const posts: PostProps[] = useMemo(
    () => data?.pages.flatMap((page) => page.reports) ?? [],
    [data],
  );

  // Update filter when posts are fetched
  useEffect(() => {
    if (!posts.length) return;

    // Get up to max 5 most recent years from posts
    const years = Array.from(
      new Set(
        posts
          .map((post) => (post.date ? post.date.slice(0, 4) : null))
          .filter((y): y is string => !!y),
      ),
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

  // Posts to display: apply year filter and sorting to either search results or all posts
  const visiblePosts = useMemo(() => {
    const baseList = searchResults ?? posts;

    const activeFilter = filter.find((f) => f.active);

    const filtered = baseList.filter((item: PostProps) => {
      if (!activeFilter) return true;

      // If filter is "all", show all posts
      if (activeFilter.team_area === "all") {
        return true;
      }

      // Filter by year: compare item's date year with the active filter's team_area (which is a year)
      const postYear = item.date ? item.date.slice(0, 4) : "";
      return postYear === activeFilter.team_area;
    });

    // Sort by date descending (newest first) if a date exists
    return filtered.slice().sort((a, b) => {
      const aDate = a.date || "";
      const bDate = b.date || "";
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return bDate.localeCompare(aDate);
    });
  }, [posts, filter, searchResults]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const term = searchTerm.trim();

    // If search is empty, just reset to normal view
    if (!term) {
      setSearchResults(null);
      setFilter(
        filter.map((item) =>
          item.team_area === "all"
            ? { ...item, active: true }
            : { ...item, active: false },
        ),
      );
      return;
    }

    // Activate "All" filter while searching
    setFilter(
      filter.map((item) =>
        item.team_area === "all"
          ? { ...item, active: true }
          : { ...item, active: false },
      ),
    );

    try {
      const res = await axios.get("/api/admin/reports/search", {
        params: {
          search: term,
        },
      });

      if (res.status === 200) {
        setSearchResults(res.data as PostProps[]);
      }
    } catch {
      // On error, fall back to normal posts
      setSearchResults(null);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
    setFilter(
      filter.map((item) =>
        item.team_area === "all"
          ? { ...item, active: true }
          : { ...item, active: false },
      ),
    );
  };

  return (
    <>
      <Lander
        title_data={[
          {
            title: "Reports",
            des: "UKIBC’s research provides an authoritative analysis of the UK–India economic corridor. Our reports examine critical sectors and trends, equipping businesses and policymakers with the insight needed to navigate trade and investment opportunities with confidence.",
          },
        ]}
        button={false}
        images={[{ image: "/annual.jpg", position: "50%_50%" }]}
        flip={true}
      />
      <section id="more">
        <div className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20">
          <p className="text-4xl font-bold text-navy">Reports</p>
          <div className="w-fit h-fit flex flex-row items-center justify-center gap-2">
            <form
              action=""
              className="w-full h-fit flex flex-row items-center justify-center gap-2"
              onSubmit={(e) => handleSearch(e)}
            >
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-navy focus:outline-none rounded-full px-2 py-1 w-full"
              />

              <button
                type={searchResults ? "button" : "submit"}
                className="bg-navy text-white px-4 py-2 rounded-full"
                onClick={searchResults ? handleClearSearch : undefined}
              >
                {searchResults ? "Clear" : "Search"}
              </button>
            </form>
          </div>
          {/* <div className="w-fit h-fit flex flex-row md:gap-4 gap-2 items-center justify-center">
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
          </div> */}

          {isLoading && (
            <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
              <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin "></div>
            </div>
          )}
          <div className="w-fit mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-10  items-center justify-items-center justify-center">
            {visiblePosts.map((item: PostProps, index: number) => {
              return (
                <LandscapeCard
                  title1={item.title || ""}
                  date={item.date}
                  landscape={true}
                  image={
                    item.image.replace("ukibc", "ukibc-storage") ||
                    "/home-1.png"
                  }
                  link={"/reports/" + item.slug}
                  animation="center"
                  key={index}
                />
              );
            })}
          </div>
          {!searchResults && hasNextPage && (
            <div className="w-full flex items-center justify-center mt-10 mb-10">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className={`px-6 py-3 bg-navy text-white font-bold rounded-full hover:bg-opacity-90 transition-all duration-300 cursor-pointer ${"opacity-100 translate-y-0 scale-100"}`}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
