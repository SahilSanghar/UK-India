"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Lander from "./components/Lander";
import What from "./components/What";
import Stats from "./components/Stats";
import Who from "./components/Who";
import Membership from "./components/Membership";
import Testimonials from "./components/Testimonials";
import Box from "./components/Box";
import Sectors from "./components/Sectors";
import Contact from "./components/Contact";
import Cards from "./components/Cards";
import Fullscreen from "./components/Fullscreen";
import Locations from "./components/Locations";
import { useState } from "react";

type Section =
  | "lander"
  | "what"
  | "stats"
  | "who"
  | "membership"
  | "testimonials"
  | "testimonials2"
  | "testimonials3"
  | "testimonials4"
  | "box"
  | "sectors"
  | "cards"
  | "fullscreen"
  | "locations"
  | "contact"
  | "";

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

            {show === "what" && <What type={type} rawWhat={data.page.what} />}
          </div>
        )}

{data?.page?.box && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("box")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Box Text and Image
              </h1>
            </div>

            {show === "box" && (
              <Box
                type={type}
                rawBox={data.page.box as Record<string, unknown>[]}
              />
            )}
          </div>
        )}

        {data?.page?.cards && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("cards")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Cards
              </h1>
            </div>

            {show === "cards" && (
              <Cards
                type={type}
                rawCards={data.page.cards as Record<string, unknown>[]}
              />
            )}
          </div>
        )}

        {data?.page?.fullscreen && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("fullscreen")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Fullscreen
              </h1>
            </div>

            {show === "fullscreen" && (
              <Fullscreen
                type={type}
                rawFullscreen={
                  data.page.fullscreen as Record<string, unknown>
                }
              />
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

        {data?.page?.who && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("who")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Who We Are
              </h1>
            </div>

            {show === "who" && (
              <Who
                type={type}
                rawWho={data.page.who as Record<string, unknown>}
              />
            )}
          </div>
        )}

        {data?.page?.membership && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("membership")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Membership
              </h1>
            </div>

            {show === "membership" && (
              <Membership
                type={type}
                rawMembership={data.page.membership as Record<string, unknown>}
              />
            )}
          </div>
        )}

        {data?.page?.testimonials && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("testimonials")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Testimonials
              </h1>
            </div>

            {show === "testimonials" && (
              <Testimonials
                type={type}
                rawTestimonials={
                  data.page.testimonials as Record<string, unknown>[]
                }
              />
            )}
          </div>
        )}

        {data?.page?.testimonials2 && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("testimonials2")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Testimonials 2
              </h1>
            </div>

            {show === "testimonials2" && (
              <Testimonials
                type={type}
                rawTestimonials={
                  data.page.testimonials2 as Record<string, unknown>[]
                }
                fieldKey="testimonials2"
                label="Testimonial"
              />
            )}
          </div>
        )}

        {data?.page?.testimonials3 && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("testimonials3")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Testimonials 3
              </h1>
            </div>

            {show === "testimonials3" && (
              <Testimonials
                type={type}
                rawTestimonials={
                  data.page.testimonials3 as Record<string, unknown>[]
                }
                fieldKey="testimonials3"
                label="Testimonial"
              />
            )}
          </div>
        )}

        {data?.page?.testimonials4 && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("testimonials4")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Testimonials 4
              </h1>
            </div>

            {show === "testimonials4" && (
              <Testimonials
                type={type}
                rawTestimonials={
                  data.page.testimonials4 as Record<string, unknown>[]
                }
                fieldKey="testimonials4"
                label="Testimonial"
              />
            )}
          </div>
        )}

        {data?.page?.sectors && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("sectors")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Sectors
              </h1>
            </div>

            {show === "sectors" && (
              <Sectors
                type={type}
                rawSectors={data.page.sectors as Record<string, unknown>[]}
              />
            )}
          </div>
        )}

        {data?.page?.locations && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("locations")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Locations
              </h1>
            </div>

            {show === "locations" && (
              <Locations
                type={type}
                rawLocations={
                  data.page.locations as Record<string, unknown>[]
                }
              />
            )}
          </div>
        )}

        {data?.page?.contact && (
          <div className="flex flex-col gap-0 bg-navy/10 w-full rounded-xl px-5 py-5 mt-5">
            <div
              className="w-full cursor-pointer"
              onClick={() => toggle("contact")}
            >
              <h1 className="text-2xl font-bold flex items-center justify-left text-navy capitalize">
                Contact
              </h1>
            </div>

            {show === "contact" && (
              <Contact
                type={type}
                rawContact={data.page.contact as Record<string, unknown>}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
