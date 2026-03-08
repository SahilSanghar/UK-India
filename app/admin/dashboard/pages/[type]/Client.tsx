"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Lander from "./components/Lander";
import What from "./components/What";
import Stats from "./components/Stats";
import { useState } from "react";

type Section = "lander" | "what" | "stats" | "";

export default function Client({ type }: { type: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-pages", type],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/pages/get_by_type?type=${type}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const [show, setShow] = useState<Section>("");

  const toggle = (section: Section) =>
    setShow((prev) => (prev === section ? "" : section));

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pb-10 pt-25 px-5 z-20">
      <h1 className="text-4xl font-bold flex items-center justify-center pt-10 mb-2 text-navy capitalize">
        Edit {type.replace(/-/g, " ")}
      </h1>

      <div className="w-full flex flex-col gap-2">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading {type.replace(/-/g, " ")} page</p>}

        {data?.page?.lander && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("lander")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Lander
              </h1>
            </div>

            {show === "lander" && (
              <Lander
                type={type}
                rawLander={data.page.lander}
                rawButton={data.page.lander?.button}
                rawFlip={data.page.lander?.flip}
              />
            )}
          </div>
        )}

        {data?.page?.what && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("what")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                What We Do
              </h1>
            </div>

            {show === "what" && (
              <What type={type} rawWhat={data.page.what} />
            )}
          </div>
        )}

        {data?.page?.stats && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("stats")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Stats
              </h1>
            </div>

            {show === "stats" && (
              <Stats
                type={type}
                rawStats={data.page.stats as Record<string, unknown>}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
