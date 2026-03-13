"use client";

import BoxImageText from "@/components/BoxImageText";
import Carousel from "@/components/Carousel";
import Connect from "@/components/Connect";
import Lander from "@/components/Lander";

interface PageProps {
  id: string;
  title: string;
  type: string;
  lander: {
    title: string[];
    title2?: string[];
    des: string[];
    image: string[];
    flip: boolean;
    button: {
      enable: boolean;
      text: string;
      link: string;
    };
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
    circle?: {
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
  box?: {
    title: string;
    content: string;
    buttonTxt: string;
    link: string;
    image: string[];
  }[];
  contact?: {
    title: string;
    content: string;
    image: string;
  };
}

export default function TNE({ page }: { page: PageProps }) {
  return (
    <>
      <Lander
        title_data={page.lander.title.map((t, i) => ({
          title: t,
          title2: page.lander.title2?.[i] ?? undefined,
          des: page.lander.des[i] ?? undefined,
        }))}
        button={page.lander.button?.enable || false}
        buttonTxt={page.lander.button?.text || ""}
        buttonLink={page.lander.button?.link || ""}
        currency={true}
        flip={page.lander.flip || false}
        images={
          page.lander.image && page.lander.image.length > 0
            ? page.lander.image.map((img) => ({
                image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${img}.webp`,
                position: "50%_50%",
              }))
            : [
                {
                  image: "/person.jpg",
                  position: "50%_50%",
                },
              ]
        }
      />
      <BoxImageText
        title={page.box?.[0]?.title || ""}
        description={page.box?.[0]?.content || ""}
        buttonText={page.box?.[0]?.buttonTxt || ""}
        buttonLink={page.box?.[0]?.link || ""}
        className="my-20"
        images={
          page.box?.[0]?.image && page.box[0].image.length > 0
            ? page.box[0].image.map((image: string) => ({
                image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${image}.webp`,
                position: "center",
              }))
            : [
                {
                  image: "/noble2.jpg",
                  position: "center",
                },
                {
                  image: "/noble3.jpg",
                  position: "center",
                },
              ]
        }
        flip={false}
      />

      <div className="w-full h-fit flex flex-col gap-10 items-center justify-center pb-20">
        <h1 className="md:text-4xl text-2xl xl:text-5xl font-bold text-navy">
          {page.box?.[1]?.title || ""}
        </h1>
        <div className="max-w-[70%] text-left ">
          <p
            className="mb-4 text-sm md:text-base text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.box?.[1]?.content || "" }}
          ></p>
        </div>
      </div>

      <div className="w-full h-fit flex justify-center items-center py-20 bg-black/5">
        <Carousel
          data={
            Array.isArray(page?.testimonials)
              ? page.testimonials.map(
                  (testimonial: {
                    quote: string;
                    des: string;
                    name: string;
                    role: string;
                    image: string;
                    link: string;
                  }) => ({
                    quote: testimonial.quote,
                    des: testimonial.des,
                    name: testimonial.name,
                    role: testimonial.role,
                    image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${testimonial.image}.webp`,
                    link: testimonial.link,
                  }),
                )
              : []
          }
        />
      </div>

      <Connect
        title={page.contact?.title || "Connect with us:"}
        description={page.contact?.content || ""}
        image={
          `https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${page.contact?.image}.webp` ||
          "/connect.webp"
        }
      />
    </>
  );
}
