"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import InfoCard from "@/components/InfoCard";

interface PostProps {
  id: number;
  image: string;
  title: string;
  date: string;
  jetpack_featured_media_url: string;
  excerpt: string;
  link: string;
  slug: string;
}

interface PostsCarouselProps {
  posts: PostProps[];
}

export default function PostsCarousel({ posts }: PostsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.emit("select");
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 ">
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex py-5">
          {posts.map((post: PostProps) => (
            <div
              key={post.id}
              className="shrink-0 flex justify-center mr-0 sm:mr-6"
              style={{
                minWidth: "320px",
                maxWidth: "350px",
              }}
            >
              <InfoCard
                title1={post.title}
                date={post.date || ""}
                image={post.image.replace("ukibc", "ukibc-storage") || "/home-1.png"}
                link={"/news/" + post.slug}
                animation="center"
              />
            </div>
          ))}
        </div>

        {/* Left gradient shadow */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(to right, rgba(255, 255, 255, 0.95), transparent)",
          }}
        />

        {/* Right gradient shadow */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(to left, rgba(255, 255, 255, 0.95), transparent)",
          }}
        />
      </div>

      {/* Navigation Buttons */}
      {posts.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-0 cursor-pointer top-1/2 -translate-y-1/2 w-12 h-12 rounded-full  flex items-center justify-center hover:scale-110 transition-all duration-100 z-20 md:-ml-6"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-11 text-navy"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 cursor-pointer top-1/2 -translate-y-1/2 w-12 h-12 rounded-full  flex items-center justify-center hover:scale-110 transition-all duration-100 md:-mr-6 z-20"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-11 text-navy rotate-180"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {posts.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {posts.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-200 ${
                selectedIndex === index
                  ? "bg-navy scale-110"
                  : "bg-navy/30 hover:bg-navy/60"
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
