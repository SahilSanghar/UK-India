"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

interface PageProps {
  id: number;
  title: string;
  type: string;
}

export default function Page() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pages"],
    queryFn: async () =>
      await axios.get("/api/admin/pages").then((res) => res.data),
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pb-10 pt-25 px-10 z-20">
      <h1 className="text-4xl font-bold flex items-center justify-center pt-10 mb-2 text-navy">
        Pages
      </h1>
      <p className="text-sm text-center flex items-center justify-center mb-5 w-fit mx-auto rounded-full  text-black ">
        What page would you like to edit?
      </p>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading pages</p>
      ) : (
        <div className="flex flex-row flex-wrap gap-5 items-center justify-center">
          {data?.pages.map((page: PageProps) => (
            <div
              key={page.id}
              className="hover:cursor-pointer hover:scale-105 transition-all duration-150 w-[20rem] h-48 bg-navy/10 flex items-center justify-center border border-gray-300 rounded-md p-2āā"
              onClick={() => {
                router.push(
                  `/admin/dashboard/pages/${page.title.toLowerCase().replace(/ /g, "-")}`,
                );
              }}
            >
              <p className="text-navy font-bold text-xl capitalize">{page.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
