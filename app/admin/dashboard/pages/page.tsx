"use client";

import axios from "axios";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface PageProps {
  id: number;
  title: string;
  type: string;
}

export default function Page() {
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
        <div className="flex flex-col items-center justify-center">
          {data?.pages.map((page: PageProps) => (
            <div key={page.id}>{page.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
