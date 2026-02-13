"use client";

import Connect from "@/components/Connect";
import Lander from "@/components/Lander";
import React, { use } from "react";

export default function page() {
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Vacancies",
          },
        ]}
        flip={true}
        button={true}
        buttonLink="/contact"
        buttonTxt="Apply Now"
        images={[{ image: "/vacancies.jpg", position: "50%_50%" }]}
      />

      <section id="more" className="w-screen h-fit py-20">
        {" "}
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center text-center">
          <h1 className="md:text-4xl text-2xl font-bold text-navy">
            Why Work with Us?
          </h1>
          <p className="md:text-lg text-sm font-medium leading-relaxed md:w-full w-[90%] text-center m-auto ">
            At UKIBC, we value continuous learning, teamwork, and professional
            growth. We are committed to creating an inclusive workplace that
            respects and celebrates diversity. In addition to a competitive
            benefits package, we offer:
          </p>

          <ul className="list-disc pl-6 text-left">
            <li>Opportunities to engage with business and policy leaders</li>
            <li>Professional development and training programs</li>
            <li>A collaborative and supportive team culture</li>
            <li>
              The chance to work on meaningful projects with global impact
            </li>
          </ul>

          <p className="text-center text-lg font-medium leading-relaxed md:w-full w-[90%] text-center m-auto ">
            If you are passionate about fostering UK-India relations and eager
            to work in a fast-paced, impactful environment, we’d love to hear
            from you.
            {/* <br />
            <br />
            No Current Vacancies at present. This is likely to change so please
            do check this page regularly. */}
          </p>
        </div>
      </section>
      <Connect
        title="Connect with us:"
        description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
        image="/connect.webp"
      />
    </>
  );
}
