import React from "react";
import Client from "./Client";
import { fetchPage } from "@/lib/fetchPage";

interface PageProps {
  id: string;
  title: string;
  type: string;
  lander: {
    title: string[];
    des: string[];
    image: string[];
    button: {
      enable: boolean;
      text: string;
      link: string;
    };
  };
  what: {
    title: string;
    des: string;
    cards: {
      title: string;
      des: string;
      images: string[];
    }[];
  };
  stats?: {
    title: string;
    cards: {
      title: string;
      valueBefore: string;
      valueAfter: string;
      number: number;
      des: string;
      disclaimer: string;
      link: string;
    }[];
  };
  who?: {
    title: string;
    cards: {
      title: string;
      image: string;
    }[];
  };
  membership?: {
    title: string;
    subtitle: string;
    des: string;
    image: string;
    buttonTxt: string;
    link: string;
  };
  testimonials?: {
    quote: string;
    des: string;
    name: string;
    role: string;
    image: string;
    link: string;
  }[];
}

const getPages = async () => {
  const page = await fetchPage("home");
  return page as PageProps;
};

export default async function Page() {
  const page = await getPages();

  // console.log(page);
  return <Client pages={page} />;
}

export const revalidate = 3600;
