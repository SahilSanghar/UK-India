"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GAP = 2; // breathing room below the navbar, in px

export default function NewUpdateStrip() {
  // The navbar is `fixed` and has no set height (it scales with the logo
  // and padding), so a hardcoded margin drifts out of sync with it. Measure
  // the real navbar height instead and sit just below it with a fixed gap.
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;

    const update = () => setOffset(nav.getBoundingClientRect().height + GAP);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full bg-tiger text-white"
      style={{ marginTop: offset ?? 96, visibility: offset ? "visible" : "hidden" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-3 text-center sm:text-left">
        <p className="text-sm md:text-base font-medium">
          <span className="font-bold">NEW Update</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span className="block sm:inline">
            Strengthening Northern England&apos;s engagement with India
          </span>
        </p>
        <Link
          href="/strategic-partnership"
          className="shrink-0 flex items-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-navy/90 transition-colors"
        >
          Know More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
