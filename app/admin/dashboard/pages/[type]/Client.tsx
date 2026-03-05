"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type LanderType = {
  title: string[];
  des: string[];
};

export default function Client({ type }: { type: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-pages", type],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/pages/get_by_type?type=${type}`);
      return res.data;
    },
    // Makes sure data is always refetched when type changes
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  // Ensure initial state syncs with loaded data
  const [lander, setLander] = useState<LanderType>({
    title: [],
    des: [],
  });

  useEffect(() => {
    if (data?.page?.lander?.title) {
      setLander((prev) => ({
        ...prev,
        title: Array.isArray(data.page.lander.title)
          ? data.page.lander.title
          : typeof data.page.lander.title === "string"
            ? [data.page.lander.title]
            : [],
      }));
    }
    // Could add similar for description if needed
  }, [data?.page?.lander?.title]);

  const [titleInput, setTitleInput] = useState<string>("");

  const handleTitleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    setLander((prev) => ({
      ...prev,
      title: [...prev.title, titleInput.trim()],
    }));
    setTitleInput("");
    // TODO: Add API call here to persist to backend if needed
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pb-10 pt-25 px-10 z-20">
      <h1 className="text-4xl font-bold flex items-center justify-center pt-10 mb-2 text-navy capitalize">
        Edit {type.replace(/-/g, " ")}
      </h1>

      <div>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading {type.replace(/-/g, " ")} page</p>}

        {data?.page?.lander && (
          <div>
            <h1 className="text-2xl font-bold">Lander</h1>
            <form onSubmit={handleTitleAdd}>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-navy text-white px-4 py-2 rounded-md mt-2"
              >
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              {lander.title.length === 0 && (
                <span className="text-gray-400">No titles added yet.</span>
              )}
              {lander.title.map((title, index) => (
                <div
                  className="text-base font-bold bg-navy rounded-full w-fit flex items-center justify-center px-4 py-2 text-white"
                  key={`${title}-${index}`}
                >
                  {title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
