"use client";

import Connect from "@/components/Connect";
import InfoCard from "@/components/InfoCard";
import Lander from "@/components/Lander";
import React from "react";

export default function page() {
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Projects",
            title2:
              "At UKIBC, our projects drive meaningful impact, helping businesses across sectors capitalize on the dynamic UK-India relationship.",
            des: "Through targeted case studies, we showcase how our expertise supports companies to overcome challenges, navigate new markets, and accelerate growth.",
          },
        ]}
        button={false}
        images={[{ image: "/annual.jpg", position: "50%_50%" }]}
        flip={true}
      />

      <section
        id="more"
        className="w-full h-fit flex flex-col gap-10 items-center justify-center py-20"
      >
        <p className="text-4xl font-bold text-navy text-center">Projects</p>
        <div className="w-full h-fit flex md:flex-row flex-col gap-10 items-center justify-center">
          <InfoCard
          title1="Membership"
            image="/l2.jpg"
            animation="center"
            buttonText="View Projects"
            large={true}
            idiot={true}
            link="/membership-projects"
          />
          <InfoCard
            title1="Business Solutions"
            image="/case.webp"
            animation="center"
            buttonText="View Projects"
            large={true}
            idiot={true}
            link="/business-solution-projects"
          />
        </div>
      </section>

      <Connect
        title="Connect with Us"
        description="We're here to help you with your projects. Get in touch with us today."
        image="/connect.webp"
      />
    </>
  );
}
