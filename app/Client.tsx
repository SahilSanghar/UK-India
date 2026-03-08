"use client";

import Lander from "@/components/Lander";
import StatCard from "@/components/StatCard";
import Carousel from "@/components/Carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { WistiaPlayer } from "@wistia/wistia-player-react";
import Companies from "@/components/Companies";
import PostsCarousel from "@/components/PostsCarousel";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { useSetNavbar } from "@/lib/navbar-context";
import { useInView } from "react-intersection-observer";
import FullCard from "@/components/FullCard";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import LiquidButton from "@/components/LiquidButton";
import ZoomCard from "@/components/ZoomCard";
import Video from "next-video";
import map from "@/videos/map.mp4";
import Fullscreen from "@/components/Fullscreen";
import Ticker from "@/components/Ticker";

interface StatCard {
  title: string;
  valueBefore: string;
  valueAfter: string;
  number: number;
  des: string;
  disclaimer: string;
  link: string;
}

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
    cards: StatCard[];
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

export default function Home({ pages }: { pages: PageProps }) {
  const [video, setVideo] = useState(false);

  const [posts, setPosts] = useState([]);

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

  const { ref: membershipRef, inView: membershipInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });
  const { ref: aboutRef, inView: aboutInView } = useInView({
    threshold: [0.05, 0.5],
    rootMargin: "0px 0px -89% 0px",
  });

  useEffect(() => {
    axios
      .get("/api/admin/posts?limit=10")
      .then((res) => {
        setPosts(res.data.posts);
        // console.log(res.data[0].yoast_head_json.og_image[0].url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (aboutInView || membershipInView) {
      setNavbar(mobile ? false : true);
    } else {
      setNavbar(mobile ? false : false);
    }
  }, [membershipInView, aboutInView, setNavbar, mobile]);

  const defaultStats: StatCard[] = [
    {
      title: "Over",
      valueBefore: "",
      valueAfter: "+",
      number: 825,
      des: "businesses and universities have used our services",
      disclaimer: "",
      link: "/interaction",
    },
    {
      title: "Recruited",
      valueBefore: "",
      valueAfter: "",
      number: 46000,
      des: "students from UKIBC Consortium Universities",
      disclaimer: "(Last 6 years)",
      link: "/launchpad",
    },
    {
      title: "Revenue",
      valueBefore: "£",
      valueAfter: " Billion",
      number: 600,
      des: "of revenue to the worlds economy",
      disclaimer: "",
      link: "/launchpad",
    },
  ];

  return (
    <>
      <Lander
        title_data={pages.lander.title.map((t, i) => ({
          title: t,
          des: pages.lander.des[i] ?? undefined,
        }))}
        button={pages.lander.button?.enable || false}
        buttonTxt={pages.lander.button?.text || ""}
        buttonLink={pages.lander.button?.link || ""}
        currency={true}
        video={true}
        images={
          pages.lander.image && pages.lander.image.length > 0
            ? pages.lander.image.map((img) => ({
                image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${pages.type}/${img}.webp`,
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

      <div className="w-full h-fit flex flex-col gap-2 justify-center items-center py-20 overflow-x-hidden max-w-full">
        <Ticker
          title={posts.slice(0, 5).map((post: { title: string }) => post.title)}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-navy md:text-5xl text-3xl font-bold text-center flex mt-20"
        >
          {pages.what?.title || "Unknown Title"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: false }}
          className="text-gray-900 text-center md:text-xl text-md font-medium lg:w-full w-[80%]"
        >
          {pages.what?.des || "Unknown Description"}
        </motion.p>

        <div className="w-full lg:flex-row flex-col mt-20 grid md:grid-cols-3 grid-cols-1 overflow-x-hidden max-w-full">
          {" "}
          {pages.what?.cards.map(
            (card: {
              title: string;
              des: string;
              images: string[];
              link?: string;
            }) => (
              <FullCard
                key={card.title}
                title1={card.title}
                image={card.images[0]}
                des={card.des}
                animation="center"
                large={true}
                images={card.images.map((image) => ({
                  image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${pages.type}/${image}.webp`,
                  position: "50%_50%",
                }))}
                idiot={false}
                link={card.link || ""}
              />
            ),
          )}
          {/* <FullCard
            title1="Interaction"
            image="/home-card2.jpeg"
            des="We put you in the room with decision-makers through high-level convening across the UK-India corridor."
            animation="center"
            large={true}
            time={8000}
            images={[
              { image: "/home/eyes/interact-1.webp", position: "50%_100%" },
              { image: "/home/eyes/interact-2.webp", position: "50%_50%" },
              { image: "/home/eyes/interact-3.webp", position: "50%_50%" },
              { image: "/home/eyes/interact-4.webp", position: "50%_50%" },
            ]}
            idiot={false}
            link="/interaction"
          />
          <FullCard
            title1="Influence"
            image="/home-card1.png"
            des="We help you influence your audience through our strategic insights and expert advice."
            animation="left"
            large={true}
            idiot={false}
            link="/influence"
            time={5000}
            images={[
              { image: "/inf1.webp", position: "50%_50%" },
              { image: "/inf2.webp", position: "50%_50%" },
              { image: "/home/eyes/influence-3.webp", position: "50%_50%" },
              // { image: "/home/eyes/influence-4.jpg", position: "bottom-right" },
            ]}
          />
          <FullCard
            title1="Intelligence"
            image="/home-card3.jpg"
            des="We offer a range of solutions helping you enter, expand and grow in the Indian market"
            animation="right"
            large={true}
            idiot={false}
            link="/intelligence"
            time={5000}
            images={[
              { image: "/home/eyes/intel-1.webp", position: "50%_100%" },
              { image: "/home/eyes/intel-2.webp", position: "50%_50%" },
              { image: "/home/eyes/intel-3.webp", position: "50%_50%" },
              { image: "/home/eyes/intel-4.webp", position: "50%_50%" },
            ]}
          /> */}
          {/* <div className="col-span-2 md:col-span-1">
            <FullCard
              title1="Intelligence"
              image="/home-card3.jpg"
              des="We offer a range of solutions helping you enter, expand and grow in the Indian market"
              animation="right"
              large={true}
              idiot={false}
              link="/intelligence"
              time={5000}
              images={[
                { image: "/home/eyes/intel-1.png", position: "50%_100%" },
                { image: "/home/eyes/intel-2.png", position: "50%_50%" },
                { image: "/home/eyes/intel-3.png", position: "50%_50%" },
                { image: "/home/eyes/intel-4.png", position: "50%_50%" },
              ]}
            />
          </div> */}
        </div>
      </div>

      <div className="w-full h-fit pt-10 flex flex-col justify-center items-center pb-20">
        <div className="w-full h-fit flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-15 justify-center items-center text-center">
          {(pages.stats?.cards && pages.stats.cards.length > 0
            ? pages.stats.cards
            : defaultStats
          ).map((stat, idx) => {
            const animations: ("left" | "center" | "right")[] = [
              "left",
              "center",
              "right",
            ];
            return (
              <StatCard
                key={idx}
                title={stat.title}
                valueBefore={stat.valueBefore}
                valueAfter={stat.valueAfter}
                animation={animations[idx % 3]}
                number={stat.number}
                description={stat.des}
                disclaimer={stat.disclaimer || undefined}
                link={stat.link || undefined}
              />
            );
          })}
        </div>

        {/* <div className="hidden md:flex w-1/2 h-5 mt-10 my-0 md:my-20 border-b-2 border-black" /> */}
        {/* who we are */}
        <section className="flex h-fit  md:w-[75%] md:my-10 md:mt-20 mt-20 justify-center items-center flex-col">
          <div className=" w-full md:w-full ">
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 md:text-5xl  text-3xl font-bold text-navy text-center"
            >
              {pages.who?.title || "Who we are"}
            </motion.h2>

            {/* List */}
            <div className="relative w-full max-w-full overflow-x-hidden flex h-[450px] justify-center items-center">
              <ZoomCard
                data={
                  pages.who?.cards && pages.who.cards.length > 0
                    ? pages.who.cards.map((card) => ({
                        title: card.title,
                        image: `https://d2paj8ptqa22jg.cloudfront.net/pages/${pages.type}/${card.image}.webp`,
                        link: "",
                      }))
                    : [
                        {
                          title:
                            "The UK India Business Council catalyses bilateral trade and opportunity in both countries.",
                          image: "/home/who-we-are/1.webp",
                          link: "",
                        },
                        {
                          title:
                            "We strengthen last-mile connectivity between government, industry, and academia, creating a trusted pathway for trade, investment, and high-impact collaboration.",
                          image: "/home/who-we-are/2.webp",
                          link: "",
                        },
                        {
                          title:
                            "We help you realise your potential through forward-looking insights, powerful networks, policy advocacy, and hands-on market-entry support.",
                          image: "/home/who-we-are/3.webp",
                          link: "",
                        },
                      ]
                }
              />
            </div>
          </div>
          {/* <div className="flex flex-col md:flex-row h-full justify-center items-center mt-10 space-y-8 md:space-y-0 md:space-x-10 ">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-900 font-medium text-sm md:text-lg leading-5 md:mr-10 md:mt-10 w-full md:w-auto px-4 md:px-0 text-center md:text-left"
            >
              Here is a look into our purpose, our people, and the impact we
              strive to create.
              <div className="w-fit h-fit flex justify-center md:justify-start mt-7 mx-auto md:mx-0">
                <LiquidButton text="Meet the team" link="/team" />
              </div>
            </motion.div>

            <div className="w-full flex flex-col md:flex-row justify-center items-center gap-5 mt-5 md:mt-20 relative ">
              <div className="w-4/5 h-full md:w-[600px] aspect-video max-w-full rounded-xl relative ">
                {!video && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      onClick={() => setVideo(true)}
                      className="size-20 md:size-30 text-white/80 absolute top-0 left-0 right-0 bottom-0 m-auto shadow-lg cursor-pointer"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Image
                      src="/home-youtube.jpg"
                      alt="home-card1"
                      width={0}
                      height={0}
                      sizes="100vw"
                      onClick={() => setVideo(true)}
                      className="object-cover w-full h-full rounded-xl object-center cursor-pointer"
                    />
                  </>
                )}
                {video && (
                  <div className="w-full h-full bg-black absolute top-0 left-0 right-0 bottom-0 rounded-xl">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/u7z_hq0XMfM?si=28hcM-riwb-vMgNp&autoplay=1"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="w-full h-full rounded-xl flex m-auto"
                      allowFullScreen={true}
                    ></iframe>
                  </div>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20, y: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:block w-[600px] h-[337.5px] bg-tiger rounded-xl absolute md:translate-x-5 translate-y-5 -z-10 right-0 md:right-auto"
              />
            </div>
          </div> */}
        </section>
      </div>

      {/* membership */}

      <Fullscreen
        ref={membershipRef as unknown as React.RefObject<HTMLDivElement>}
        title1={pages?.membership?.title || "Membership"}
        title2={pages?.membership?.subtitle || "Right place, Right people"}
        description={
          pages?.membership?.des ||
          "Join a trusted ecosystem where business, government, and academia meet with intent. As a member, you gain access to curated B2G and B2B forums that turn dialogue into insight and insight into opportunity. Our platform connects you with decision-makers, leading institutions, and growth-ready enterprises to build relationships that deliver long-term value."
        }
        image={
          `https://d2paj8ptqa22jg.cloudfront.net/pages/${pages.type}/${pages?.membership?.image}.webp` ||
          "/home-membership.jpg"
        }
        buttonText={pages?.membership?.buttonTxt || "JOIN THE NETWORK"}
        buttonLink={pages?.membership?.link || "/membership"}
      />
      {/* testimonials */}
      <div className="w-full h-fit flex justify-center items-center py-20 bg-mix2">
        <Carousel
          data={
            Array.isArray(pages?.testimonials)
              ? pages.testimonials.map((testimonial: { quote: string; des: string; name: string; role: string; image: string; link: string }) => ({
                  quote: testimonial.quote,
                  des: testimonial.des,
                  name: testimonial.name,
                  role: testimonial.role,
                  image:
                    `https://d2paj8ptqa22jg.cloudfront.net/pages/${pages.type}/${testimonial.image}.webp`,
                  link: testimonial.link,
                }))
              : []
          }
        />
      </div>

      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(1 45 107)"
        gradientBackgroundEnd="rgb(0 11 25)"
        firstColor="3, 107, 252"
        secondColor="2, 87, 207"
        thirdColor="1, 30, 71"
        fourthColor="139, 187, 254"
        fifthColor="139, 187, 254"
        interactive={false}
        containerClassName="w-full min-h-screen md:h-screen h-[120vh] flex  justify-center items-center bg-navy relative"
      >
        {/* <AuroraBackground> */}

        <div
          className="md:w-[80%] w-[90%] z-10 left-0 right-0 top-0 bottom-0 absolute flex flex-col md:flex-row items-center gap-10 md:gap-0 justify-center md:justify-normal mx-auto"
          ref={aboutRef}
        >
          <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center px-4 md:px-12">
            <p className="text-4xl md:text-5xl font-bold text-white mb-2 wrap-break-word">
              {"UK India Business Council".split(" ").map((word, wIdx) => (
                <span
                  key={wIdx}
                  className="inline-block md:whitespace-nowrap mr-2"
                >
                  {word.split("").map((char, cIdx) => (
                    <motion.span
                      key={cIdx}
                      className="text-white inline-block"
                      initial={{ rotateX: 90, opacity: 0 }}
                      whileInView={{ rotateX: 0, opacity: 1 }}
                      transition={{
                        duration: 1,
                        delay: (wIdx * 5 + cIdx) * 0.1,
                      }}
                      viewport={{ once: false }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </p>
            <p className="text-white text-lg font-bold italic mb-2">
              Boosting trade and investment collaboration.
            </p>
            <p className="text-white text-base md:text-lg leading-5 font-medium mb-6">
              Equal partnerships to fuel shared prosperity—a force for global
              good.
            </p>
            <Link
              href="/about"
              className="rounded-full  bg-tiger px-8 py-3 text-sm font-semibold tracking-wide text-white  transition hover:bg-mix hover:text-black hover:scale-105 duration-200 w-max"
            >
              About UKIBC
            </Link>
          </div>

          <div className="w-full md:w-1/2">
            <div className="rounded-xl overflow-hidden w-full h-full">
              <Video
                src={map}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls={false}
              />
            </div>
          </div>
        </div>

        {/* </AuroraBackground> */}
      </BackgroundGradientAnimation>

      <div className="w-full h-fit flex flex-col justify-center items-center pt-10 pb-30 ">
        <Companies
          images={[
            "/home-company1.png",
            "/home-company2.jpg",
            "/home-company3.png",
            "/home-company4.png",
            "/home-company5.png",
            "/home-company6.png",
          ]}
        />

        {/* <div className="w-1/2 h-5 my-10 border-b-2 border-black" /> */}

        <div className=" h-fit flex justify-between items-center w-[90%] md:w-full max-w-7xl mx-auto mt-20">
          <p className="md:text-5xl text-3xl font-bold text-navy">UKIBC news</p>
          <Link
            href="/news"
            className="text-navy text-xl font-medium hover:scale-105 hover:text-navy/80 transition-all duration-200 inline-block"
          >
            {"View all >"}
          </Link>
        </div>
        <PostsCarousel posts={posts} />
      </div>
    </>
  );
}
