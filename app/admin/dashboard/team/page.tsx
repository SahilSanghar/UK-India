"use client";

import React, { useEffect, useState } from "react";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";

interface PostProps {
  id: number;
  title: string;
  image: string;
  slug: string;
  job_title: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  date: string;
  sort: string;
}

export default function Page() {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["team"],
      queryFn: ({ pageParam }) =>
        axios
          .get("/api/admin/team", {
            params: {
              limit: 0,
              lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
            },
          })
          .then((res) => res.data),
      getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
      initialPageParam: undefined,
    });

  const [sortedTeam, setSortedTeam] = useState<PostProps[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const nextTeam =
      data?.pages
        .flatMap((page) => (page?.team as PostProps[]) ?? [])
        ?.filter(Boolean) ?? [];

    // initialize list ordered by `sort` from DB
    const sortedBySort = [...nextTeam].sort((a, b) => {
      if (a.sort < b.sort) return -1;
      if (a.sort > b.sort) return 1;
      return 0;
    });

    // eslint-disable-next-line
    setSortedTeam(sortedBySort);
  }, [data]);

  const callSortUpdateApi = async (
    left: string,
    right: string,
    id: string,
    date: string
  ) => {
    try {
      await axios.post("/api/admin/team/sort", { left, right, id, date });
    } catch (error) {
      console.error("Failed to update team sort order", error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["team"] });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();

    // auto scroll page when dragging near top/bottom
    const { clientY } = event;
    const threshold = 200;
    const viewportHeight = window.innerHeight;

    if (clientY < threshold) {
      window.scrollBy({ top: -50, behavior: "smooth" });
    } else if (clientY > viewportHeight - threshold) {
      window.scrollBy({ top: 50, behavior: "smooth" });
    }

    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setSortedTeam((prev: PostProps[]) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);

      // Find the left and right sort keys **surrounding** the new index
      const leftSort = updated[index - 1]?.sort ?? null;
      const rightSort = updated[index + 1]?.sort ?? null;
      void callSortUpdateApi(
        leftSort,
        rightSort,
        updated[index].id.toString(),
        updated[index].date.toString()
      );

      return updated;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col pb-10 pt-25 px-10 z-20">
        <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
          Team Members
        </h1>
        <p className="text-sm text-center flex items-center justify-center mb-5 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white ">
          Total members: {data?.pages[0].count ?? 0}
        </p>

        <p className="text-sm text-black text-center mb-10">
          Drag and drop to reorder the team members.
          <br />
          (Editing is not available yet)
        </p>
        <div className="w-full h-fit flex-col gap-5 flex justify-center items-center">
          {isLoading ? (
            <>
              <p>Loading...</p>
            </>
          ) : (
            <>
              {sortedTeam?.map((member: PostProps, index: number) => {
                const isDragged = draggedIndex === index;
                const isDragOver = dragOverIndex === index;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    key={member.id}
                    className={`w-full bg-black/10 h-fit flex items-center rounded-lg p-4 gap-5 cursor-move transition-all duration-150 ${
                      isDragged ? "opacity-60 scale-[0.99]" : ""
                    } ${
                      isDragOver && !isDragged
                        ? "ring-2 ring-navy/60 shadow-lg"
                        : ""
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                  >
                    <Image
                      src={member.image || "/person.jpg"}
                      alt={member.title || "No title"}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="rounded-full w-24 h-24 object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-bold text-navy">
                        {member.title}
                      </p>
                      <p className="text-sm text-black font-bold">
                        {member.job_title}
                      </p>
                      <p className="text-sm text-black">{member.location}</p>
                      {/* <p className="text-sm text-black">{member.email}</p>
                      <p className="text-sm text-black">{member.phone}</p>
                      <p className="text-sm text-black">{member.website}</p>
                      <p className="text-sm text-black">{member.facebook}</p>
                      <p className="text-sm text-black">{member.twitter}</p>
                      <p className="text-sm text-black">{member.instagram}</p>
                      <p className="text-sm text-black">{member.linkedin}</p> */}
                    </div>

                    <div className="ml-auto mr-5 underline cursor-pointer">
                      <p className="text-black font-medium">Edit</p>
                    </div>
                  </motion.div>
                );
              })}
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
