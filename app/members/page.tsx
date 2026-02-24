"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSetNavbar } from "@/lib/navbar-context";
import { motion } from "framer-motion";
import Lander from "@/components/Lander";
import Connect from "@/components/Connect";
import Person from "@/components/Person";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface TeamMemberProps {
  title: string;
  image: string;
  filters: string[];
  content: string;
  location: string;
  job_title: string;
  address: string;
  url: string;
  sort?: string; // sort key from DB
}

export default function Members() {
  const setNavbar = useSetNavbar();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref: intelligenceRef, inView: intelligenceInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });
  const { ref: landerRef, inView: landerInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });
  const { ref: membershipRef, inView: membershipInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });

  const [activeFilterValue, setActiveFilterValue] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: () =>
      axios.get("/api/admin/members").then((res) => res.data.members),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  console.log(data);

  // Build filter chips dynamically from team member filters
  const filterOptions = useMemo(() => {
    // The only filters to use
    const finalFilters = [
      { name: "Strategic Partners", value: "strategic-partners" },
      { name: "Corporate Plus", value: "sector-policy-groups" },
      { name: "Corporate", value: "roundtables" },
    ];

    return [{ name: "All", value: "all" }, ...finalFilters];
  }, []);

  useEffect(() => {
    if (intelligenceInView) {
      setNavbar(true);
    } else if (landerInView) {
      setNavbar(false);
    } else if (membershipInView) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  }, [intelligenceInView, membershipInView, landerInView, setNavbar]);

  return (
    <>
      <Lander
        ref={landerRef as unknown as React.RefObject<HTMLDivElement>}
        title_data={[
          {
            title: "Members",
            // title2: "Shaping the Conversations That Shape Policy",
           
          },
        ]}
        button={false}
        flip={true}
        currency={false}
        images={[
          { image: "/about.webp", position: "bottom-right" },
          // { image: "/home/lander/1.webp", position: "50%_100%" },
          // { image: "/home/lander/2.webp", position: "50%_50%" },
          // { image: "/home/lander/3.webp", position: "10%_10%" },
        ]}
      />
      {/* <SimpleLander
        ref={landerRef as unknown as React.RefObject<HTMLDivElement>}
        heading1="Influence"
        description="Shaping the Conversations That Shape Policy"
        image="/home-card1.png"
        button={true}
        buttonLink="/influence#more"
      /> */}

      <section id="more">
        <div className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20">
          <p className="md:text-4xl text-2xl font-bold text-navy">
            Our Members
          </p>

          {/* Filters toggle */}
          <div className="w-[90%] xl:w-[70%] flex flex-col items-center gap-3">
            {/* <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full border border-navy text-navy  hover:bg-navy hover:text-white transition-colors duration-200 cursor-pointer ${showFilters ? "bg-navy text-white" : "bg-white text-black"}`}
            >
              {showFilters ? "Hide filters" : "Show filters"}
            </button> */}

            {!showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col items-center "
              >
                <div className="flex w-full justify-end">
                  {/* <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="text-xs md:text-sm text-navy/70 hover:text-navy underline cursor-pointer"
                  >
                    Close
                  </button> */}
                </div>
                <div className="w-full h-fit flex flex-wrap gap-2 md:gap-4 items-center justify-center">
                  {filterOptions.map((item, index) => {
                    const isActive = activeFilterValue === item.value;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.05,
                          type: "spring",
                          damping: 10,
                          stiffness: 100,
                        }}
                        key={item.value}
                        className="flex flex-row items-center justify-center cursor-pointer w-auto h-full"
                        onClick={() => setActiveFilterValue(item.value)}
                      >
                        <p
                          className={`text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full cursor-pointer duration-300 ${
                            isActive
                              ? "bg-navy border-2 border-navy text-white"
                              : "text-navy bg-white border-2 border-navy"
                          }`}
                        >
                          {item.name == "Ict" ? "ICT" : item.name}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
              <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin "></div>
            </div>
          )}
          <div className="w-[90%] mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-0 gap-y-10  items-start justify-items-start justify-center ">
            {data
              ?.filter((item: TeamMemberProps) => {
                const activeFilter = activeFilterValue;
                if (!activeFilter) return true;

                // If filter is "all", show all team members
                if (activeFilter === "all") {
                  return true;
                }

                // Check if team member's filters contain the active filter value
                return item.filters?.some(
                  (className) => className === activeFilter,
                );
              })
              .sort((a: TeamMemberProps, b: TeamMemberProps) => {
                // sort using DB `sort` value (string compare),
                // same logic as admin dashboard team page
                const aSort = a.sort ?? "";
                const bSort = b.sort ?? "";

                if (aSort < bSort) return -1;
                if (aSort > bSort) return 1;
                return 0;
              })
              .map((item: TeamMemberProps, index: number) => {
                return (
                  <Person
                    name={item.title}
                    image={
                      item.image
                        ? `${item.image.replace("ukibc", "ukibc-storage")}${
                            item.image.includes("?") ? "&" : "?"
                          }v=${Math.floor(new Date().getTime() / 60000)}`
                        : "/person.jpg"
                    }
                    link={item.url ? item.url : "#"}
                    role={item.job_title || ""}
                    des1={item.content}
                    location={item.address || ""}
                    theme="dark"
                    key={index}
                  />
                );
              })}
          </div>
        </div>

        <Connect
          title="Enquiries"
          description="To find out more about UKIBC, speak to one of our experts. Gain instant access to a network of businesses and organisations across sectors such as Digital, Food and Drink, Legal and Professional Services, and Higher Education."
          image="/connect.webp"
        />
      </section>
    </>
  );
}
