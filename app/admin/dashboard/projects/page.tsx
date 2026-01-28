"use client";

import React from "react";

import InfoCard from "@/components/InfoCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import LandscapeCard from "@/components/LandscapeCard";

interface ProjectProps {
  id: number;
  title: string;
  image: string;
  slug: string;
  date: string;
}

export default function Page() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["projects"],
      queryFn: ({ pageParam }) =>
        axios
          .get("/api/admin/projects", {
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

  const projects = data?.pages.flatMap((page) => page.projects) ?? [];

  return (
    <>
      <div className="w-full h-full flex flex-col overflow-x-hidden bg-white pb-10 pt-24">
        <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
          Projects
        </h1>
        <p className="text-sm text-center flex items-center justify-center mb-10 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white">
          Total Projects: {data?.pages[0].count ?? 0}
        </p>
        <div className="w-fit h-fit flex-col gap-10 justify-center items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 mx-auto">
          {isLoading ? (
            <>
              <InfoCard loading={true} />
              <InfoCard loading={true} />
              <InfoCard loading={true} />
            </>
          ) : (
            <>
              {projects?.map((project: ProjectProps) => (
                <LandscapeCard
                  title1={project.title}
                  image={project.image || "/person.jpg"}
                  animation="center"
                  date={project.date}
                  key={project.id}
                  link={"/business-solution-projects/" + project.slug}
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
