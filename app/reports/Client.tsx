"use client";

import Lander from "@/components/Lander";
import React, { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LandscapeCard from "@/components/LandscapeCard";

interface PostProps {
  image: string;
  title: string;
  date: string;
  slug: string;
}

interface FilterItem {
  name: string;
  team_area: string;
  active: boolean;
  sort: number;
}

const fetchAllReports = async (): Promise<PostProps[]> => {
  const res = await axios.get("/api/admin/reports", {
    params: { limit: 1000 },
  });
  return res.data.reports ?? [];
};

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

const REPORTS_PER_PAGE = 12;

export default function Page({ page }: { page: PageProps }) {
  const [filter, setFilter] = useState<FilterItem[]>([
    { name: "All", team_area: "all", active: true, sort: 0 },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PostProps[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["reports-all"],
    queryFn: fetchAllReports,
  });

  // Build year filters from posts
  useEffect(() => {
    if (!posts.length) return;

    const allYears = Array.from(
      new Set(
        posts
          .map((post) => (post.date ? post.date.slice(0, 4) : null))
          .filter((y): y is string => !!y),
      ),
    ).sort((a, b) => Number(b) - Number(a)).slice(0, 3);

    const activeArea = filter.find((f: FilterItem) => f.active)?.team_area ?? "all";

const filters: FilterItem[] = [
  { name: "All", team_area: "all", active: activeArea === "all", sort: 0 },
  ...allYears.map((year, idx) => ({
    name: year,
    team_area: year,
    active: activeArea === year,
    sort: idx + 1,
  })),
];

    const activeFound = filters.some((f: FilterItem) => f.active);
    if (!activeFound && filters.length) filters[0].active = true;

    setFilter(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const visiblePosts = useMemo(() => {
    const baseList = searchResults ?? posts;
    const activeFilter = filter.find((f: FilterItem) => f.active);

    const filtered = baseList.filter((item: PostProps) => {
      if (!activeFilter || activeFilter.team_area === "all") return true;
      const postYear = item.date ? Number(item.date.slice(0, 4)) : null;
      if (!postYear) return false;
      return String(postYear) === activeFilter.team_area;
    });

    return filtered.slice().sort((a: PostProps, b: PostProps) => {
      const aDate = a.date || "";
      const bDate = b.date || "";
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return bDate.localeCompare(aDate);
    });
  }, [posts, filter, searchResults]);

  const totalPages = Math.ceil(visiblePosts.length / REPORTS_PER_PAGE);
  const paginatedPosts = visiblePosts.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("more")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFilterChange = (item: FilterItem) => {
    setFilter(
      filter.map((i: FilterItem) =>
        i.sort === item.sort ? { ...i, active: true } : { ...i, active: false },
      ),
    );
    setCurrentPage(1);
  };

  const getPageNumbers = (): (number | "...")[] => {
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

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = searchTerm.trim();

    if (!term) {
      setSearchResults(null);
      setCurrentPage(1);
      setFilter(
        filter.map((item: FilterItem) =>
          item.team_area === "all" ? { ...item, active: true } : { ...item, active: false },
        ),
      );
      return;
    }

    setFilter(
      filter.map((item: FilterItem) =>
        item.team_area === "all" ? { ...item, active: true } : { ...item, active: false },
      ),
    );

    try {
      const res = await axios.get("/api/admin/reports/search", {
        params: { search: term },
      });
      if (res.status === 200) {
        setSearchResults(res.data as PostProps[]);
        setCurrentPage(1);
      }
    } catch {
      setSearchResults(null);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults(null);
    setCurrentPage(1);
    setFilter(
      filter.map((item: FilterItem) =>
        item.team_area === "all" ? { ...item, active: true } : { ...item, active: false },
      ),
    );
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
          <p className="text-4xl font-bold text-navy">Reports</p>

          {/* Search + Year Filter inline */}
          <div className="w-fit h-fit flex flex-row items-center justify-center gap-2">
            <form
              className="w-full h-fit flex flex-row items-center justify-center gap-2"
              onSubmit={handleSearch}
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

            {/* Year Filter */}
            {!searchResults && (
              <div className="w-fit h-fit flex flex-row md:gap-3 gap-2 items-center justify-center ps-2 max-w-[250vw]">
                {filter.map((item: FilterItem) => (
                  <button
                    key={item.sort}
                    onClick={() => handleFilterChange(item)}
                    className={`text-sm font-bold md:px-4 px-3 md:py-2 py-1 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap ${
                      item.active
                        ? "bg-navy border-2 border-navy text-white"
                        : "text-navy bg-white border-2 border-navy hover:bg-navy/10"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoading && (
            <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
              <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Reports Grid */}
          <div className="w-fit mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-center justify-items-center justify-center">
            {paginatedPosts.map((item: PostProps, index: number) => (
              <LandscapeCard
                key={index}
                title1={item.title || ""}
                date={item.date}
                landscape={true}
                image={
                  item.image.replace("ukibc", "ukibc-storage") || "/home-1.png"
                }
                link={"/reports/" + item.slug}
                animation="center"
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