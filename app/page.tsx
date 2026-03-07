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
}

const getPages = async () => {
  const res = await fetch(process.env.PUBLIC_URL + "/api/admin/pages", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pages");
  }
  const data = await res.json();
  return data.pages as unknown as PageProps[];
};

export default async function Page() {
  const pages = await getPages();
  console.log(pages[0].lander);
  return <Client pages={pages[0]} />;
}
