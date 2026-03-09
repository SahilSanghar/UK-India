import React from "react";
import Client from "./Client";

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
  const res = await fetch(process.env.PUBLIC_URL + "/api/admin/pages/get_by_type?type=home", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pages");
  }
  const data = await res.json();

  return data.page as PageProps;
};

export default async function Page() {
  const page = await getPages();
  return <Client pages={page} />;
}
