"use client";

import React, { useEffect, useState } from "react";
import SimpleLander from "@/components/simpleLander";
import { useInView } from "react-intersection-observer";
import BoxImageText from "@/components/BoxImageText";
import { useSetNavbar } from "@/lib/navbar-context";
import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/components/LiquidButton";
import Fullscreen from "@/components/Fullscreen";
import Carousel from "@/components/Carousel";
import StatCard from "@/components/StatCard";
import Lander from "@/components/Lander";
import ImageSlider from "@/components/ImageSlider";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Connect from "@/components/Connect";
import TeamCard from "@/components/Team";
import Person from "@/components/Person";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface TeamMemberProps {
  title: string;
  image: string;
  filters: string[]
  content: string;
  location: string;
  job_title: string;
}

export default function Team() {
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
      name: "Executive Leadership Team",
      active: false,
      team_area: "executive_leadership_team",
      sort: 0,
    },
    {
      name: "Business Solutions",
      team_area: "business_solutions",
      active: false,
      sort: 1,
    },
    {
      name: "Membership and Advocacy",
      team_area: "membership_and_advocacy",
      active: false,
      sort: 2,
    },
    {
      name: "Business Operations",
      team_area: "business_operations",
      active: false,
      sort: 3,
    },
    {
      name: "Events",
      team_area: "events",
      active: false,
      sort: 4,
    },
  ]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["team"],
    queryFn: () => axios.get("/api/admin/team").then((res) => res.data.team),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

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
            title: "Meet the Team",
            // title2: "Shaping the Conversations That Shape Policy",
            des: "The UK India Business Council (UKIBC) team is committed to enhancing the trade and investment relationship between the UK and India, fostering a vibrant and equitable economic partnership that creates jobs and prosperity in both nations while serving as a force for global good.",
          },
        ]}
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
            Our Team Members
          </p>
          <div className="w-full h-fit flex flex-wrap gap-2 md:gap-4 items-center justify-center">
            {filter.map((item) => (
              <div
                key={item.sort}
                className="flex flex-row items-center justify-center cursor-pointer w-auto h-full"
                onClick={() =>
                  setFilter(
                    filter.map((i) =>
                      i.sort === item.sort
                        ? { ...i, active: true }
                        : { ...i, active: false },
                    ),
                  )
                }
              >
                <p
                  className={`text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full cursor-pointer duration-300 ${
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
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center mx-auto mt-10">
              <div className="w-10 h-10 border-5 border-navy border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin "></div>
            </div>
          )}
          <div className="w-[80%] mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-0 gap-y-10  items-start justify-items-start justify-center ">
            {data?.filter((item: TeamMemberProps) => {
                const activeFilter = filter.find((f) => f.active);
                if (!activeFilter) return true;

                // If filter is "all", show all team members
                if (activeFilter.team_area === "all") {
                  return true;
                }

                // Check if team member's class_list contains a matching team_area class
                // Convert filter.team_area from "business_solutions" to "business-solutions"
                const teamAreaClass = `${activeFilter.team_area.replace(
                  /_/g,
                  "-",
                )}`;
                return item.filters?.some(
                  (className) => className === teamAreaClass,
                );
              })
              .sort((a: TeamMemberProps, b: TeamMemberProps) => {
                const activeFilter = filter.find((f) => f.active);

                // Only sort when "all" is selected
                if (activeFilter?.team_area !== "all") {
                  return 0;
                }

                // Define the order of team areas
                const teamAreaOrder = [
                  "executive_leadership_team",
                  "business_solutions",
                  "membership_and_advocacy",
                  "business_operations",
                  "events",
                ];

                // Helper function to get the sort order of a team member
                const getTeamMemberSortOrder = (
                  member: TeamMemberProps,
                ): number => {
                  for (let i = 0; i < teamAreaOrder.length; i++) {
                    const teamArea = teamAreaOrder[i];
                    const teamAreaClass = `${teamArea.replace(
                      /_/g,
                      "-",
                    )}`;
                    if (
                      member.filters?.some(
                        (className) => className === teamAreaClass,
                      )
                    ) {
                      return i;
                    }
                  }
                  // If no matching team area found, put at the end
                  return teamAreaOrder.length;
                };

                const orderA = getTeamMemberSortOrder(a);
                const orderB = getTeamMemberSortOrder(b);
                return orderA - orderB;
              })
              .map((item: TeamMemberProps, index: number) => {
                return (
                  <Person
                    name={item.title}
                    image={
                      item.image || "/person.jpg"
                    }
                    role={item.job_title || ""}
                    des1={item.content}
                    location={item.location || ""}
                    theme="dark"
                    key={index}
                  />
                );
              })}
          </div>
        </div>

        {/* <BoxImageText
          title="Our Approach"
          description="Our expert in-house team of account managers, sector specialists, and consultants curate and convene a powerful bilateral network spanning industry, academia, and government, creating platforms where informed dialogue shapes outcomes. <br/><br/>We work in partnership with multiple levels of government: at the National and State levels in India, and the devolved administration, city region, and national levels in the UK."
          buttonText="Meet the team"
          className="my-20"
          buttonLink="/team"
          images={[
            { image: "/home/eyes/influence-1.png", position: "center" },
            { image: "/home/eyes/influence-2.png", position: "center" },
            { image: "/home/eyes/influence-3.png", position: "center" },
          ]}
          flip={false}
        /> */}

        {/* <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(251 206 188)"
          gradientBackgroundEnd="rgb(241 92 35)"
          firstColor="3, 107, 252"
          secondColor="2, 87, 207"
          thirdColor="1, 30, 71"
          fourthColor="139, 187, 254"
          fifthColor="139, 187, 254"
          interactive={false}
          containerClassName="w-full min-h-screen md:h-screen h-[150vh]  flex  justify-center items-center bg-navy relative"
        >
          <div
            className=" z-10 absolute top-0 left-0 mx-auto w-full h-screen flex flex-col justify-center items-center text-center gap-20 py-30 "
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="text-5xl font-bold text-white flex   w-[40%]">
              Our intelligence network supports your
            </h1>
            <ul className="flex gap-10">
              {[
                "Business Operations",
                "Government Relations",
                "Advocacy Support",
              ].map((item, index) => {
                return (
                  <motion.div
                    initial={{
                      y: 10,
                      opacity: 0,
                      scale: 1,
                    }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.5 },
                    }}
                    whileTap={{
                      scale: 1.1,
                      transition: { duration: 0.1 },
                    }}
                    transition={{ duration: 0.1 }}
                    key={index}
                    className="flex flex-col gap-2 items-center justify-center"
                  >
                    {index === 0 ? (
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-10 text-white "
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                            clipRule="evenodd"
                          />
                          <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                        </svg>
                      </div>
                    ) : index === 1 ? (
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-10 text-white "
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25a.75.75 0 0 1 .75.75v.756a49.106 49.106 0 0 1 9.152 1 .75.75 0 0 1-.152 1.485h-1.918l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 18.75 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 0 1-.262 1.453h-8.37a.75.75 0 0 1-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 0 1-.375.84A6.723 6.723 0 0 1 5.25 18a6.723 6.723 0 0 1-3.181-.795.75.75 0 0 1-.375-.84L4.168 6.241H2.25a.75.75 0 0 1-.152-1.485 49.105 49.105 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75Zm4.878 13.543 1.872-7.662 1.872 7.662h-3.744Zm-9.756 0L5.25 8.131l-1.872 7.662h3.744Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-10 text-white "
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                            clipRule="evenodd"
                          />
                          <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                        </svg>
                      </div>
                    )}
                    <li key={index} className="text-xl font-bold text-white">
                      {item}
                    </li>
                  </motion.div>
                );
              })}
            </ul>
            <div className="w-full  h-fit flex flex-row sm:flex-row gap-6 sm:gap-10 md:gap-15 justify-center text-center ">
              <StatCard
                animation="left"
                number={105}
                description="UKIBC Members"
                color="white"
              />
              <StatCard
                animation="center"
                number={1200}
                description="Attendees in financial year 2024/25"
                color="white"
              />
              <StatCard
                animation="right"
                number={4}
                description="MoUs with State Governments Signed"
                color="white"
              />
            </div>
          </div>
        </BackgroundGradientAnimation> */}

        {/* <Fullscreen
          ref={membershipRef as unknown as React.RefObject<HTMLDivElement>}
          title1="Membership"
          title2="The Right Rooms. The Right People."
          description="Join a trusted ecosystem where business, government, and academia meet with intent. As a member, you gain access to curated B2G and B2B forums that turn dialogue into insight and insight into opportunity. Our platform connects you with decision-makers, leading institutions, and growth-ready enterprises to build relationships that deliver long-term value."
          image="/home-membership.jpg"
          buttonText="JOIN THE NETWORK"
          buttonLink="/membership"
        />
        <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
          <Carousel
            data={[
              {
                quote:
                  "UKIBC is now at the forefront of their dialogue for sustainability and how energy transition is advancing and the technology benefits that can happen between the two countries.",
                name: "Nandita- Sahgal Tully",
                role: "Group Board Member UKIBC",
                image: "/home/testimonial/nandita.webp",
              },
              {
                quote:
                  "Tata is a long-standing UKIBC member as we value the insights their excellent team provide and the interactions they curate with senior figures from business and government.",
                name: "Tim Jones",
                role: "Executive Director, Tata",
                image: "/home/testimonial/tim.webp",
              },
            ]}
          />
        </div> */}

        <Connect
          title="Enquiries"
          description="To find out more about UKIBC, speak to one of our experts. Gain instant access to a network of businesses and organisations across sectors such as Digital, Food and Drink, Legal and Professional Services, and Higher Education."
          image="/connect.webp"
        />
      </section>
    </>
  );
}
