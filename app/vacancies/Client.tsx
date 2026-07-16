"use client";

import Connect from "@/components/Connect";
import Lander from "@/components/Lander";
import { normalizeRichTextHtml } from "@/lib/normalizeRichTextHtml";
import { PageProps } from "@/lib/PageProps";
import InfoCard from "@/components/InfoCard";

// interface PageProps {
//   id: string;
//   title: string;
//   type: string;
//   lander: {
//     title: string[];
//     title2?: string[];
//     des: string[];
//     image: string[];
//     flip: boolean;
//     button: {
//       enable: boolean;
//       text: string;
//       link: string;
//     };
//   };
//   stats?: {
//     title: string;
//     cards: {
//       title: string;
//       valueBefore: string;
//       valueAfter: string;
//       number: number;
//       des: string;
//       disclaimer: string;
//       link: string;
//     }[];
//     circle?: {
//       title: string;
//       image: string;
//     }[];
//   };
//   membership?: {
//     title: string;
//     subtitle: string;
//     des: string;
//     image: string;
//     buttonTxt: string;
//     link: string;
//   };
//   testimonials?: {
//     quote: string;
//     des: string;
//     name: string;
//     role: string;
//     image: string;
//     link: string;
//   }[];
//   box?: {
//     title: string;
//     content: string;
//     buttonTxt: string;
//     link: string;
//     image: string[];
//   }[];
//   contact?: {
//     title: string;
//     content: string;
//     image: string;
//   };
// }

export default function Vacancies({ page }: { page: PageProps }) {
  // Vacancies were sometimes entered into the generic "Cards" admin section
  // instead of "Fullscreen Cards" (the field this page actually renders).
  // Reading both keeps existing entries visible regardless of which section
  // they were saved under.
  const vacancyCards = [...(page.cards ?? []), ...(page.fullscreen?.cards ?? [])];

  return (
    <>
      <Lander
        title_data={(page.lander?.title ?? []).map((t, i) => ({
          title: t,
          title2: page.lander?.title2?.[i] ?? undefined,
          des: page.lander?.des?.[i] ?? undefined,
        }))}
        button={page.lander?.button?.enable || false}
        buttonTxt={page.lander?.button?.text || ""}
        buttonLink={page.lander?.button?.link || ""}
        currency={true}
        flip={page.lander?.flip || false}
        images={
          page.lander?.image && page.lander.image.length > 0
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

      <section id="more" className="w-screen h-fit py-20">
        {" "}
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center ">
          <h1 className="md:text-4xl text-2xl font-bold text-navy">
            {page.box?.[0]?.title || ""}
          </h1>
          <div className="md:text-base text-sm font-medium leading-relaxed md:w-full w-[90%]">
            <div
              className="m-auto font-light"
              dangerouslySetInnerHTML={{
                __html: normalizeRichTextHtml(page.box?.[0]?.content || ""),
              }}
            />
          </div>
        </div>
      </section>

      <div className="w-screen h-fit py-20 bg-linear-to-b to-blue-950 from-navy min-h-160 flex justify-center items-center">
        <div className="w-full h-fit max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center ">
          <h1 className="md:text-4xl text-2xl font-bold text-white">
            {page.fullscreen?.title || ""}
          </h1>
          <div className="md:text-base text-sm font-medium leading-relaxed md:w-full w-[90%] text-white text-center">
            <div
              className="m-auto font-light"
              dangerouslySetInnerHTML={{
                __html: normalizeRichTextHtml(page.fullscreen?.des || ""),
              }}
            />
          </div>

          <div className="w-full flex flex-wrap gap-4 items-stretch justify-center">
            {vacancyCards.length <= 0 && (
              <div className="w-full flex gap-4 items-center justify-center">
                <h2 className="md:text-xl text-xl font-medium text-white">
                  No vacancies available at the moment.
                </h2>
              </div>
            )}
            {vacancyCards.map((card, idx) => (
              <div
                key={`${card.title}-${idx}`}
                className="flex flex-col gap-4 items-center justify-center flex-[1_1_320px] min-w-[320px] max-w-md"
              >
                <InfoCard
                  title1={card.title}
                  popup={true}
                  des={card.des}
                  idiot={true}
                  large={true}
                  animation="center"
                  buttonText={card.buttonTxt}
                  link={card.link}
                  image={`https://d2paj8ptqa22jg.cloudfront.net/pages/${page.type}/${card.image}.webp`}
                />
              </div>
            ))}
          </div>
        </div>
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
