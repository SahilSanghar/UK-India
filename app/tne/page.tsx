"use client";

import BoxImageText from "@/components/BoxImageText";
import Carousel from "@/components/Carousel";
import Connect from "@/components/Connect";
import Lander from "@/components/Lander";
import React from "react";

export default function page() {
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Transnational Education (TNE)",
            title2: "Our Solution for the Higher Education Industry in India",
            des: "A staggering 92 million students are expected to be enrolled in higher education in India by 2035, making Transnational Education (TNE) an increasingly strategic opportunity for UK and Indian universities — and for millions of ambitious Indian students. TNE plays a pivotal role in widening access, addressing skills gaps in local labour markets, and enhancing the quality of education through collaboration, capacity building, and knowledge exchange.",
          },
        ]}
        button={false}
        images={[
          { image: "/tne.webp", position: "50%_50%" },
          { image: "/tne2.webp", position: "50%_50%" },
        ]}
        flip={true}
      />
      <BoxImageText
        title="Flagship TNE Report: Pathway to Success"
        description={`A practical 10 step guide to build your tailored, sustainable TNE action plan. Reach out to our expert team to help you create it. <a href="/TNE-Report-2024-Digital-File-TN-04.06.2024-compressed.pdf" target="_blank" style="color: #012d6b; text-decoration: underline;"> Click here </a>`}
        className="my-20"
        images={[
          { image: "/home/eyes/influence-3.png", position: "50%_50%" },
          { image: "/flagship-tne2.webp", position: "50%_50%" },
        ]}
      />

      <div className="w-full h-fit flex flex-col gap-10 items-center justify-center pb-20">
        <h1 className="md:text-4xl text-2xl xl:text-5xl font-bold text-navy">
          Our Solution
        </h1>
        <div className="max-w-[70%] text-left ">
          <p className="mb-4 text-sm md:text-base text-gray-700">
            India’s vision to become a global education hub is underpinned by
            the <strong>India@2047 strategy</strong> — a 25-year roadmap
            launched alongside the National Education Policy (NEP) 2020.
            Structured into five-year phases, the plan sets out a bold
            trajectory for transformation:
          </p>
          <ul className="list-disc list-inside text-sm md:text-base text-gray-700 space-y-2">
            <li>
              <strong>Phase 1 (2022–2027):</strong> Establish foundational
              reforms, including regulatory clarity, institutional autonomy, and
              expanded international collaboration.
            </li>
            <li>
              <strong>Phase 2 (2027–2032):</strong> Finalise partnerships,
              promote dual and joint degrees, and embed industry integration in
              curricula.
            </li>
            <li>
              <strong>Phase 3 (2032–2037):</strong> Strengthen India’s global
              education brand, encourage foreign campuses, and align higher
              education to future skills.
            </li>
            <li>
              <strong>Phase 4 (2037–2042):</strong> Deepen research ecosystems,
              regionalise excellence, and enhance faculty and infrastructure
              quality.
            </li>
            <li>
              <strong>Phase 5 (2042–2047):</strong> Cement India’s role as a
              global knowledge leader, exporting innovation, research, and
              educational models. For UK institutions, the time to engage with
              the education sector is now – to contribute meaningfully, build
              sustainable TNE models, and play a role in shaping India’s journey
              to 2047.
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
        <Carousel
          data={[
            {
              quote:
                "Transnational Education is the beacon illuminating the path to a truly interconnected world, where knowledge transcends borders, cultures unite, and understanding flourishes. Durham University embraces the transformative power of TNE, transcending borders to ignite minds, cultivate global citizenship, and bridge cultures, ensuring knowledge knows no bounds.",
              name: "Professor Kieran Fernandes",
              role: "Durham University",
              image: "/home/testimonial/kieran.jpg",
            },
            {
              quote:
                "As UK institutions consider tapping the vast TNE potential in India, it’s not the “what” (what programmes, what price, what location etc.) but the “how” (how to set up the centre, how to recruit, who to partner etc.) that will be more critical. Being modular in the approach: starting small, learning quickly, ability to scale fast, can help.",
              name: "Pranjal Kumar",
              role: "CFO & Head Corporate Development, Emeritus",
              image: "/home/testimonial/pranjal.jpg",
            },
          ]}
        />
      </div>

      <Connect
        title="Connect with us:"
        description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
        image="/connect.webp"
      />
    </>
  );
}
