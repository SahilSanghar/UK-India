"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

interface CompaniesProps {
  data: {
    image: string;
    link: string;
  }[];
}

export default function Companies({ data }: CompaniesProps) {
  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...data.map((item) => item.image), ...data.map((item) => item.image), ...data.map((item) => item.image)];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi, isHovered]);

  return (
    <div className="w-full h-fit flex justify-center items-center py-6 sm:py-8 md:py-10 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          className="overflow-hidden"
          ref={emblaRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex gap-4 sm:gap-6 md:gap-8">
            {duplicatedImages.map((image, index) => (
              <div
                key={index}
                className="shrink-0 flex items-center justify-center px-4 sm:px-6 md:px-8"
                style={{ minWidth: "120px" }}
              >
                <div className="relative w-full h-16 sm:h-20 md:h-40 md:w-40 hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={`https://d2paj8ptqa22jg.cloudfront.net/pages/home/${data[index % data.length].image}.webp`}
                    alt={`Company logo ${(index % data.length) + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 200px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
