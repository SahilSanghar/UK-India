import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface EventCardProps {
  title1?: string;
  date?: string;
  image?: string;
  link?: string;
  animation?: "left" | "center" | "right";
  location?: string;
  venue?: string;
  who_can_attend?: string;
  event_date?: string;
  event_end_date?: string;
  time?: string;
  loading?: boolean;
  className?: string;
}

export default function EventCard({
  className,
  title1,
  date,
  image,
  link,
  animation,
  location,
  venue,
  who_can_attend,
  event_date,
  event_end_date,
  time,
  loading,
}: EventCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: animation == "left" ? "-10%" : animation === "center" ? "0" : "10%",
        y: animation == "center" ? "10%" : "0%",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.5,
        },
      }}
      transition={{
        duration: 0.1,
      }}
      className={`${loading ? "animate-pulse bg-black/10" : "bg-white"} flex flex-col md:flex-row cursor-pointer w-full max-w-[800px] min-h-[300px] md:h-[300px] border-2 border-black/10  text-black  backdrop-blur-xl rounded-2xl ${loading ? "animate-pulse" : ""} ${className}`}
      onClick={() => link && window.open(link)}
    >
      <div className="flex flex-col w-full md:w-1/2 h-full">
        <div className="w-full p-2 md:p-3 h-[200px] md:h-[200px] overflow-hidden">
          <Image
            src={image || "/person.jpg"}
            alt={title1 || "Event Image"}
            width={0}
            height={0}
            sizes="100vw"
            className="object-cover object-center duration-300 rounded-2xl w-full h-full"
          />
        </div>
        <div className="w-full px-2 md:px-3 pb-2 md:pb-3 flex flex-col">
          <h3
            className="w-full text-base md:text-xl font-bold line-clamp-2 md:line-clamp-3 break-words overflow-hidden"
            style={{
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{
              __html: title1 || "",
            }}
          ></h3>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full flex flex-col justify-center gap-3 md:gap-5 items-start md:items-center p-3 border-t-2 md:border-t-0 md:border-l-2 border-black/10">
        {event_date && (
          <div className="flex flex-row gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 md:size-6 text-navy shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                clipRule="evenodd"
              />
            </svg>

            <p className="text-sm md:text-base font-medium break-words">
              {event_date && event_date.length === 8
                ? new Date(
                    `${event_date.substring(0, 4)}-${event_date.substring(
                      4,
                      6,
                    )}-${event_date.substring(6, 8)}`,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : event_date}{" "}
              -{" "}
              {event_end_date && event_end_date.length === 8
                ? new Date(
                    `${event_end_date.substring(0, 4)}-${event_end_date.substring(
                      4,
                      6,
                    )}-${event_end_date.substring(6, 8)}`,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : event_end_date}
            </p>
          </div>
        )}

        {time && (
          <div className="flex flex-row gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 md:size-6 text-navy shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                clipRule="evenodd"
              />
            </svg>

            <p className="text-sm md:text-base font-medium break-words">
              {time || "-"}
            </p>
          </div>
        )}

        {location && (
          <div className="flex flex-row gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 md:size-6 text-navy shrink-0"
            >
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>

            <p className="text-sm md:text-base font-medium break-words">
              {location}
            </p>
          </div>
        )}

        {/* <p className=" font-medium">{venue}</p> */}

        {who_can_attend && (
          <div className="flex flex-row gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 md:size-6 text-navy shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>

            <p className="text-sm md:text-base font-medium break-words">
              {who_can_attend.startsWith("Invite")
                ? "Invite Only"
                : who_can_attend || "-"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
