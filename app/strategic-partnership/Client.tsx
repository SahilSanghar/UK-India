"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Lander from "@/components/Lander";
import BoxImageText from "@/components/BoxImageText";
import ImageSlider from "@/components/ImageSlider";
import Connect from "@/components/Connect";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { useSetNavbar } from "@/lib/navbar-context";
import { normalizeRichTextHtml } from "@/lib/normalizeRichTextHtml";
import { PageProps } from "@/lib/PageProps";
import defaults from "./content.json";

const TYPE = "strategic-partnership";
const cdn = (img: string) =>
  `https://d2paj8ptqa22jg.cloudfront.net/pages/${TYPE}/${img}.webp`;

const images = (
  uploaded: string[] | undefined,
  fallback: string[],
): { image: string; position: string }[] =>
  (uploaded && uploaded.length > 0 ? uploaded.map(cdn) : fallback).map(
    (image) => ({ image, position: "center" }),
  );

export default function StrategicPartnership({
  page,
}: {
  page: Partial<PageProps> | null;
}) {
  // Content comes from the admin-managed record; anything missing falls back
  // to the bundled defaults so the page never renders empty.
  const lander = page?.lander ?? defaults.lander;
  const box = page?.box ?? defaults.box;
  const role = page?.fullscreen ?? defaults.fullscreen;
  const contact = page?.contact ?? defaults.contact;

  const setNavbar = useSetNavbar();
  const [mobile, setMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { ref: roleRef, inView: roleInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });

  useEffect(() => {
    setNavbar(mobile ? false : roleInView);
  }, [roleInView, setNavbar, mobile]);

  const intro = box[0];
  const impact = box[1];
  const closing = box[2];

  return (
    <>
      <Lander
        title_data={(lander.title ?? []).map((t, i) => ({
          title: t,
          title2: lander.title2?.[i] ?? undefined,
          des: lander.des?.[i] ?? undefined,
        }))}
        button={lander.button?.enable || false}
        buttonTxt={lander.button?.text || ""}
        buttonLink={lander.button?.link || ""}
        currency={true}
        flip={lander.flip ?? true}
        images={images(lander.image, [
          "/inf1.webp",
          "/inf2.webp",
          "/govtmeet.jpg",
        ])}
      />

      <section id="more">
        {intro && (
          <BoxImageText
            title={intro.title || ""}
            description={intro.content || ""}
            buttonText={intro.buttonTxt || ""}
            buttonLink={intro.link || ""}
            className="my-20"
            images={images(intro.image, ["/noble2.jpg", "/noble3.jpg"])}
            flip={false}
          />
        )}

        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(1 45 107)"
          gradientBackgroundEnd="rgb(0 11 25)"
          firstColor="3, 107, 252"
          secondColor="2, 87, 207"
          thirdColor="1, 30, 71"
          fourthColor="139, 187, 254"
          fifthColor="139, 187, 254"
          interactive={false}
          className="w-full min-h-screen flex items-center"
          containerClassName="w-full min-h-screen h-fit bg-navy relative"
        >
          <div
            className="z-10 relative mx-auto w-full max-w-6xl flex flex-col justify-center items-center text-center py-20 px-4 sm:px-6 gap-8 sm:gap-10"
            ref={roleRef as unknown as React.RefObject<HTMLDivElement>}
          >
            <h1 className="text-2xl xl:text-5xl lg:text-4xl md:text-3xl font-bold text-white">
              {role.title}
            </h1>
            <div
              className="max-w-3xl text-sm sm:text-base md:text-lg font-medium text-white/90 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:text-white [&_strong]:text-base [&_strong]:sm:text-lg [&_strong]:md:text-xl"
              dangerouslySetInnerHTML={{
                __html: normalizeRichTextHtml(role.des || ""),
              }}
            />
            <div className="w-full flex flex-wrap justify-center gap-4">
              {(role.cards ?? []).map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 10, opacity: 0 }}
                  whileInView={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.5 },
                  }}
                  viewport={{ once: true }}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] flex flex-col gap-3 items-start text-left bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5"
                >
                  <span className="w-9 h-9 shrink-0 rounded-full bg-tiger text-white font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  {card.title && (
                    <h2 className="text-base md:text-lg font-bold text-white">
                      {card.title}
                    </h2>
                  )}
                  <div
                    className="text-sm md:text-base font-medium text-white leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{
                      __html: normalizeRichTextHtml(card.des || ""),
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </BackgroundGradientAnimation>

        {(impact || closing) && (
          <div className="w-full h-fit py-20 px-0 bg-transparent">
            <div className="w-[90%] md:w-full max-w-6xl mx-auto flex flex-col gap-12">
              {impact && (
                <div className="w-full flex flex-col md:flex-row gap-6 bg-mix/10 p-4 rounded-4xl justify-center items-center">
                  <div className="flex-1 flex items-stretch rounded-2xl overflow-hidden min-h-[150px] max-h-[230px] relative bg-blue-200">
                    <ImageSlider
                      images={images(impact.image, [
                        "/banerjee.jpeg",
                        "/govtmeet.jpg",
                        "/churchHouse.jpg",
                      ])}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-4 px-4 md:px-8 gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                      {impact.title}
                    </h1>
                    <div
                      className="text-base md:text-lg font-medium text-gray-700 leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0"
                      dangerouslySetInnerHTML={{
                        __html: normalizeRichTextHtml(impact.content || ""),
                      }}
                    />
                  </div>
                </div>
              )}

              {closing && (
                <div
                  className="w-full text-base md:text-lg font-medium text-gray-700 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: normalizeRichTextHtml(closing.content || ""),
                  }}
                />
              )}
            </div>
          </div>
        )}

        <Connect
          title={contact.title || "Connect with us:"}
          description={contact.content || ""}
          image={contact.image ? cdn(contact.image) : "/connect.webp"}
        />
      </section>
    </>
  );
}
