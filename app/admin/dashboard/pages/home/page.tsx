"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/pages/get_by_type?type=home");
      console.log("res.data", res.data);
      return res.data;
    },
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pb-10 pt-25 px-10 z-20">
      <h1 className="text-4xl font-bold flex items-center justify-center pt-10 mb-2 text-navy">
        Edit Home
      </h1>

      <div>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading home page</p>}
        {data && <p>{data?.page?.title}</p>}
      </div>
    </div>
  );
}
