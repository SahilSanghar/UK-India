import React from "react";
import Image from "next/image";

export default function TeamCard({
  name,
  role,
  location,
  image,
}: {
  name: string;
  role: string;
  location: string;
  image: string;
}) {
  return (
    <div>
      <div className="w-full h-fit flex flex-row justify-center items-center leading-tight">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          <Image
            src={image.replace("ukibc", "ukibc-storage")}
            alt={name}
            width={100}
            height={100}
            className="rounded-full w-24 h-24 object-cover"
          />
          <h1 className="text-xl md:text-xl font-bold text-navy">{name}</h1>
          <p className="text-base font-bold leading-relaxed w-[60%] m-auto text-center">
            {role}
          </p>
          <p className="text-base font-medium leading-relaxed w-[60%] m-auto text-center">
            {location}
          </p>
        </div>
      </div>
    </div>
  );
}
