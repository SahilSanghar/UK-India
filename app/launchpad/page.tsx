"use client";

import React, { useEffect } from "react";
import SimpleLander from "@/components/simpleLander";
import { useInView } from "react-intersection-observer";
import BoxImageText from "@/components/BoxImageText";
import { useSetNavbar } from "@/lib/navbar-context";
import Image from "next/image";
import { motion } from "framer-motion";
import LiquidButton from "@/components/LiquidButton";
import Fullscreen from "@/components/Fullscreen";
import Carousel from "@/components/Carousel";
import StatCard from "@/components/StatCard";
import Lander from "@/components/Lander";
import ImageSlider from "@/components/ImageSlider";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Connect from "@/components/Connect";

export default function Influence() {
  const setNavbar = useSetNavbar();

  const { ref: intelligenceRef, inView: intelligenceInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });
  const { ref: landerRef, inView: landerInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });
  const { ref: membershipRef, inView: membershipInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });

  const apps = [
    {
      name: "Partner Eco-System Development",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
            clipRule="evenodd"
          />
          <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
        </svg>
      ),
    },
    {
      name: "Market Landscape Analysis",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Supply Chain Management",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
          <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
          <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
      ),
    },
    {
      name: "Product Launch Management",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
            clipRule="evenodd"
          />
          <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
        </svg>
      ),
    },
    {
      name: "Offshored Digital & Tech Teams",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const help = [
    {
      name: "Promote and build your profile in the market",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.54 15h6.42l.5 1.5H8.29l.5-1.5Zm8.085-8.995a.75.75 0 1 0-.75-1.299 12.81 12.81 0 0 0-3.558 3.05L11.03 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 0 0 1.146-.102 11.312 11.312 0 0 1 3.612-3.321Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Lead recruitment campaigns",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
        </svg>
      ),
    },
    {
      name: "Train and quality-manage agents and counsellors",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Build meaningful partnerships",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
            clipRule="evenodd"
          />
          <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
        </svg>
      ),
    },
    {
      name: "Interface with Central and State governments",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
          <path
            fillRule="evenodd"
            d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
            clipRule="evenodd"
          />
          <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
        </svg>
      ),
    },
    {
      name: "Interface with British Council, British High Commission, and UK Visas and Immigration",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const legal = [
    {
      name: "Wholly-owned subsidiary",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Liaison Office",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Branch Office",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Not-for-Profit entity",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
            clipRule="evenodd"
          />
          <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
        </svg>
      ),
    },
    {
      name: "LLP",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
          <path
            fillRule="evenodd"
            d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
            clipRule="evenodd"
          />
          <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
        </svg>
      ),
    },
  ];

  const support = [
    {
      name: "Ongoing Secretarial Compliance",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Accounting & Payroll",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
          <path
            fillRule="evenodd"
            d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "HR Advisory with HR policies, contracts, employee handbook, and an employment framework support",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (intelligenceInView) {
      setNavbar(true);
    } else if (landerInView) {
      setNavbar(false);
    } else if (membershipInView) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  }, [intelligenceInView, membershipInView, landerInView, setNavbar]);

  return (
    <>
      <Lander
        ref={landerRef as unknown as React.RefObject<HTMLDivElement>}
        title_data={[
          {
            title: "Launchpad®",
            title2: "In-Country Representation with Market Access",
            des: "Build High Value Relationships With Risk Managed Systems",
          },
        ]}
        buttonTxt="Launchpad® Services"
        buttonLink="/launchpad#services"
        flip={true}
        currency={false}
        images={[
          { image: "/l1.jpg", position: "50%_50%" },
          { image: "/home-2.jpeg", position: "50%_50%" },
          { image: "/home/eyes/influence-3.png", position: "50%_50%" },
        ]}
      />
      {/* <SimpleLander
        ref={landerRef as unknown as React.RefObject<HTMLDivElement>}
        heading1="Influence"
        description="Shaping the Conversations That Shape Policy"
        image="/home-card1.png"
        button={true}
        buttonLink="/influence#more"
      /> */}

      <section id="more">
        {/* <div className="w-full h-fiy py-20">
          <p className=" text-xl font-bold w-[60%] m-auto text-justify">
            We work to create a level playing field where industries can grow
            with confidence, clarity, and fairness. This is achieved through
            sustained advocacy with government and regulatory bodies, and by
            facilitating high-impact engagements including policy dialogues,
            roundtables, forums, receptions, delegations, and direct
            industry–government interactions.
          </p>
        </div> */}
        <p className="text-2xl md:text-3xl xl:text-4xl  font-bold text-navy text-center xl:w-[60%] w-[90%] mx-auto my-20">
          The UK-India relationship offers immense opportunities, its
          multi-stakeholder landscape can be challenging to navigate.
        </p>
        <BoxImageText
          description="Achieve your chosen objectives with UKIBC’s Launchpad®, which provides a dedicated team of in-country specialists delivering structured market access and expert representation.<br/><br/> Designed as the fastest route to a sustained India presence, Launchpad® enables organisations to focus on growing their business with a forward-looking approach, testing the market, building high-trust relationships and adapting strategy to match both organisational priorities and the dynamic ecosystem of the UK-India relationship.<br/><br/>The model is sector-agnostic and built around expert representation by industry specialists, ensuring budget predictability while reducing Permanent Establishment (PE) risk. Most importantly, it removes the immediate burden and risk of setting up a full office in India, while still acting as a catalyst for trade, investment and collaboration. <br/><br/>As your India engagement matures, you can pivot seamlessly into a more permanent structure, supported by UKIBC’s trusted ecosystem spanning the British High Commission, British Council, Association of Commonwealth Universities, University Grants Commission and wider Central and State Government entities, among other relevant networks."
          className="my-20"
          images={[
            { image: "/l2.jpg", position: "center" },
            { image: "/l3.jpg", position: "center" },
          ]}
          flip={false}
        />

        <section id="services">
          <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(1 45 107)"
            gradientBackgroundEnd="rgb(0 11 25)"
            firstColor="3, 107, 252"
            secondColor="2, 87, 207"
            thirdColor="1, 30, 71"
            fourthColor="139, 187, 254"
            fifthColor="139, 187, 254"
            interactive={false}
            containerClassName="w-full min-h-screen md:h-screen h-[150vh]  flex  justify-center items-center bg-navy relative"
          >
            <div
              className=" z-10 absolute top-0 left-0 mx-auto w-full md:h-screen h-[150vh] flex flex-col justify-center items-center text-center gap-20 py-30 "
              ref={
                intelligenceRef as unknown as React.RefObject<HTMLDivElement>
              }
            >
              <h1 className="md:text-5xl text-3xl font-bold text-white flex  md:w-[40%] w-fit ">
                Using Launchpad® Services
              </h1>
              <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center place-items-center w-full">
                <div className="hidden md:flex col-span-1 md:col-span-3 w-fit justify-center">
                  {apps.slice(0, 3).map((app, index) => (
                    <motion.div
                      initial={{
                        y: 10,
                        opacity: 0,
                        scale: 1,
                      }}
                      whileInView={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.5 },
                      }}
                      whileTap={{
                        scale: 1.1,
                        transition: { duration: 0.1 },
                      }}
                      transition={{ duration: 0.1 }}
                      key={index}
                      className="flex flex-col gap-2 items-center justify-center text-center mx-6"
                    >
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center mx-auto">
                        {app.svg}
                      </div>
                      <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                        {app.name}
                      </li>
                    </motion.div>
                  ))}
                </div>
                <div className="hidden md:flex col-span-1 md:col-span-3 w-full justify-center mt-5">
                  {apps.slice(3).map((app, index) => (
                    <motion.div
                      initial={{
                        y: 10,
                        opacity: 0,
                        scale: 1,
                      }}
                      whileInView={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.5 },
                      }}
                      whileTap={{
                        scale: 1.1,
                        transition: { duration: 0.1 },
                      }}
                      transition={{ duration: 0.1 }}
                      key={index + 3}
                      className="flex flex-col gap-2 items-center justify-center text-center mx-6"
                    >
                      <div className="px-7 py-7 bg-tiger rounded-full flex items-center justify-center mx-auto">
                        {app.svg}
                      </div>
                      <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                        {app.name}
                      </li>
                    </motion.div>
                  ))}
                </div>
                {/* mobile view */}
                <div className="cols-span-1 md:col-span-3 w-full grid grid-cols-2 md:hidden justify-center items-center gap-5">
                  {apps.map((app, index) => (
                    <motion.div
                      initial={{
                        y: 10,
                        opacity: 0,
                        scale: 1,
                      }}
                      whileInView={{
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.5 },
                      }}
                      whileTap={{
                        scale: 1.1,
                        transition: { duration: 0.1 },
                      }}
                      transition={{ duration: 0.1 }}
                      key={index}
                      className="flex flex-col gap-2 items-center justify-center text-center mx-6"
                    >
                      <div className="px-5 py-5 bg-tiger rounded-full flex items-center justify-center mx-auto">
                        {app.svg}
                      </div>
                      <li className="md:text-xl text-base font-bold text-white text-center list-none md:w-[60%] w-full">
                        {app.name}
                      </li>
                    </motion.div>
                  ))}
                </div>
              </ul>
              {/* <div className="w-full  h-fit flex flex-row sm:flex-row gap-6 sm:gap-10 md:gap-15 justify-center text-center ">
              <StatCard
                animation="left"
                number={105}
                description="UKIBC Members"
                color="white"
              />
              <StatCard
                animation="center"
                number={1200}
                description="Attendees in financial year 2024/25"
                color="white"
              />
              <StatCard
                animation="right"
                number={4}
                description="MoUs with State Governments Signed"
                color="white"
              />
            </div> */}
            </div>
          </BackgroundGradientAnimation>
        </section>

        <BoxImageText
          title="Launchpad® drives your India strategy now and sets you up for what comes next."
          description="We help you map the right India model with clarity and confidence, backed by advisors who bring last-mile connectivity and trusted networks across government, industry and academia. It is future-focused, practical, and built for impact."
          className="my-20"
          buttonText="Meet our Launchpad® Experts"
          buttonLink="/team?filter=business_solutions"
          images={[
            { image: "/l4.jpg", position: "center" },
            { image: "/l5.jpg", position: "center" },
          ]}
          flip={true}
        />

        <div className="w-full h-fit min-h-screen  flex  justify-center items-center bg-navy bg-gradient-to-b from-navy to-black/50">
          <div
            className=" z-10 top-0 left-0 mx-auto w-full  flex flex-col justify-center items-center text-center gap-20 py-30 "
            ref={intelligenceRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="md:text-4xl text-xl font-bold text-white flex  md:w-[60%] w-[90%] ">
              With Launchpad®, our dedicated and exclusive team on the ground in
              India can help you
            </h1>
            <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center place-items-center w-full">
              <div className="cols-span-1 md:col-span-3 md:w-[70%] w-[90%] grid md:grid-cols-3  grid-cols-2 justify-center items-center gap-5">
                {help.map((app, index) => (
                  <motion.div
                    initial={{
                      y: 10,
                      opacity: 0,
                      scale: 1,
                    }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.5 },
                    }}
                    whileTap={{
                      scale: 1.1,
                      transition: { duration: 0.1 },
                    }}
                    transition={{ duration: 0.1 }}
                    key={index}
                    className="flex flex-col h-full gap-2 items-center  text-center md:mx-6 mx-2 "
                  >
                    <div className="px-5 py-5 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      {app.svg}
                    </div>
                    <li className="md:text-lg text-[12px] font-bold text-white text-center list-none xl:w-[90%] w-full">
                      {app.name}
                    </li>
                  </motion.div>
                ))}
              </div>
            </ul>
            <h1 className="md:text-2xl text-sm font-bold text-white flex  md:w-[60%] w-[90%] ">
              Beyond in-country representation, UKIBC provides integrated
              consulting and establishment support for organisations and UK SMEs
              looking to formalise and scale their India presence. We help
              support the establishment of the right structures through the
              following
            </h1>
            <h1 className="md:text-4xl text-xl font-bold text-white flex text-center justify-center items-center  md:w-[60%] w-[90%] ">
              Legal Set-up in India
            </h1>
            <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center place-items-center w-full">
              <div className="cols-span-1 md:col-span-3 md:w-[70%] w-[90%] grid md:grid-cols-3  grid-cols-2 justify-center items-center gap-5">
                {legal.map((app, index) => (
                  <motion.div
                    initial={{
                      y: 10,
                      opacity: 0,
                      scale: 1,
                    }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.5 },
                    }}
                    whileTap={{
                      scale: 1.1,
                      transition: { duration: 0.1 },
                    }}
                    transition={{ duration: 0.1 }}
                    key={index}
                    className="flex flex-col h-full gap-2 items-center  text-center md:mx-6 mx-2 "
                  >
                    <div className="px-5 py-5 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      {app.svg}
                    </div>
                    <li className="md:text-lg text-[12px] font-bold text-white text-center list-none xl:w-[90%] w-full">
                      {app.name}
                    </li>
                  </motion.div>
                ))}
              </div>
            </ul>

            <h1 className="md:text-4xl text-xl font-bold text-white flex text-center justify-center items-center  md:w-[60%] w-[90%] ">
              Ongoing Support Services
            </h1>
            <ul className="gap-3 grid grid-cols-1 md:grid-cols-3 justify-items-center items-center place-items-center w-full">
              <div className="cols-span-1 md:col-span-3 md:w-[70%] w-[90%] grid md:grid-cols-3  grid-cols-2 justify-center items-center gap-5">
                {support.map((app, index) => (
                  <motion.div
                    initial={{
                      y: 10,
                      opacity: 0,
                      scale: 1,
                    }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                      transition: { duration: 0.5 },
                    }}
                    whileTap={{
                      scale: 1.1,
                      transition: { duration: 0.1 },
                    }}
                    transition={{ duration: 0.1 }}
                    key={index}
                    className="flex flex-col h-full gap-2 items-center  text-center md:mx-6 mx-2 "
                  >
                    <div className="px-5 py-5 bg-tiger rounded-full flex items-center justify-center mx-auto">
                      {app.svg}
                    </div>
                    <li className="md:text-lg text-[12px] font-bold text-white text-center list-none xl:w-[90%] w-full">
                      {app.name}
                    </li>
                  </motion.div>
                ))}
              </div>
            </ul>

            <h1 className="md:text-2xl text-sm font-bold text-white flex text-center justify-center items-center  md:w-[60%] w-[90%] ">
              Through Launchpad® and our wider consulting, compliance and
              operational advisory services, UKIBC combines in-country
              representation with structured market access, helping
              organisations test, establish and grow in India with confidence
              and control.
            </h1>
          </div>
        </div>

        <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
          <Carousel
            data={[
              {
                quote:
                  "It would not have been possible to deliver the Launchpad project successfully within such a challenging time frame without the highly professional and well-organised support from UKIBC’s India office.",
                name: "Ian Mckernan",
                role: "Chairman, Molecular Products Group Ltd.",
                image: "/home/testimonial/ian.webp",
              },
              {
                quote:
                  "The flexible infrastructure of the Launchpad service has been well thought out, and the quality communication from the UK India Business Council meant we were operational in India ahead of schedule and within budget. I would wholeheartedly recommend Launchpad to any company looking to establish a local presence in India.",
                name: "David Enright",
                role: "General Manager, Amari Aerospace",
                image: "/person.jpg",
              },
              {
                quote:
                  "The assistance of UKIBC through its Launchpad service has been vital in providing the board with confidence to make the initial investment into India, and to provide ongoing compliance support and expertise as the business develops.",
                name: "Dan Munro",
                role: "Group Managing Director, PJ Valves",
                image: "/home/testimonial/dan.webp",
              },
            ]}
          />
        </div>

        <Connect
          title="Connect with us:"
          description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
          image="/connect.webp"
        />
      </section>
    </>
  );
}
