"use client";
import React from "react";
import Lander from "@/components/Lander";
import BoxImageText from "@/components/BoxImageText";
import Connect from "@/components/Connect";
import Carousel from "@/components/Carousel";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import LiquidButton from "@/components/LiquidButton";
export default function page() {
  const news = [
    {
      title: "UK qualifications recognised in India’s draft education policy",
      link: "/news/uk-and-india-agree-to-mutual-recognition-of-qualifications",
    },
    {
      title: "Insurance FDI cap raised from 49% to 74%",
      link: "/news/government-of-india-raises-fdi-limit-in-defence-manufacturing",
    },
    {
      title: "Law Commission support for legalising sports betting",
      link: "/reports/gaming-for-growth-indias-sports-and-gaming-market-potential",
    },
    {
      title: "Two-year UK post-study work visa reinstated",
      link: "/news/ukibc-welcomes-opening-of-new-uk-graduate-immigration-route/",
    },
    {
      title: "Flexible food labelling regulations introduced",
      link: "/news/advocacy-win-extension-of-implementation-date-of-food-safety-and-standards-labelling-and-display-regulation/",
    },
    {
      title:
        "Corporate tax on foreign company branches reduced from 43.68% to 35%",
      link: "/news/ukibc-welcomes-indian-corporate-tax-rate-reduction/",
    },
  ];
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Government Relations",
          },
        ]}
        flip={true}
        button={false}
        images={[
          { image: "/banerjee.jpeg", position: "50%_50%" },
          { image: "/meet2.webp", position: "50%_50%" },
        ]}
      />
      <BoxImageText
        title="Turning Opportunity into Impact"
        description={`India offers huge potential for UK businesses—from exports and investment to partnerships and innovation. But turning potential into impact takes more than just interest; it requires <b> Influence, Intelligence and Interaction. </b>
          <br><br> That’s where the UK India Business Council comes in. <br><br> As the leading trade and investment organisation in the UK-India corridor, we work closely with government at both national and state levels. Our strong, trusted relationships allow us to open doors, solve problems, and shape the environment in ways that benefit individual businesses. <br><br> We give you a direct line to decision-makers, helping you navigate India’s regulatory landscape and make your voice heard. Whether it’s breaking down barriers or accelerating opportunity, we are here to help UK businesses succeed in India. `}
        className="mt-20"
        images={[{ image: "/tilted.jpg", position: "50%_50%" }]}
      />
      <BoxImageText
        title="Removing Barriers, Opening Doors"
        description={`We know from our members’ success in India that it doesn’t just depend on finding the right opportunity—it’s about making it easier to act on it. That’s why we focus on the things that matter most to business: reducing friction, improving the rules of the game, and creating a future-focused environment that brings government, industry, and academia together so UK and Indian companies can thrive through stronger ideas, networks, and impact.
          <br><br>  We focus on the sectors and issues our members say matter most for the UK–India relationship. This helps shape a clearer, more supportive business environment so you can focus on growth, not barriers.
<br> <br>Here’s how we make that happen: <br><br>
<li> We develop and deliver policy recommendations that tackle both sector-specific and cross-sector issues</li>
<li> Our “Ease of Doing Business” group engages national and state governments in ongoing reform conversations</li>
<li> We provide tailored, hands-on support to help you overcome specific regulatory or policy challenges</li>
<li> We organise high-level roundtables and closed-door meetings with senior officials to ensure your business concerns are heard </li> <li> Our events and conferences spotlight industry expertise and convert member insights into actionable policy recommendations </li> `}
        flip={true}
        className="mb-10 mt-10"
        images={[{ image: "/home/eyes/influence-3.png", position: "50%_50%" }]}
      />
      <BoxImageText
        title="Trusted and Endorsed by Government"
        description={`For over a decade, the UKIBC has worked to improve the operating environment acted as a trusted B2G and G2B conduit. Over this period, the UKIBC has developed close working relationships across Central and State Governments in India, leading to multiple MoUs, and becoming a trusted partner on key India programmes such as Access India.
          <br><br> The UK Government leverages our expertise to facilitate
<li> <b>The UK-India Joint Economic and Trade Committee: </b> an initiative co-chaired by trade ministers from both countries with sectoral workstreams to enact change.
<li> The UK-India CEO Forum: this advises Prime Ministers from both nations on priorities for trade and investment </b> 
<li> <b>The UK-India FTA:  </b>  The UKIBC is proud to have facilitated business consultation and feedback to the Government, in advance of and during negotiations.
 `}
        className="mb-20"
        images={[{ image: "/meetred.jpg", position: "50%_50%" }]}
      />

      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(1 45 107)"
        gradientBackgroundEnd="rgb(0 11 25)"
        firstColor="3, 107, 252"
        secondColor="2, 87, 207"
        thirdColor="1, 30, 71"
        fourthColor="139, 187, 254"
        fifthColor="139, 187, 254"
        interactive={false}
        containerClassName="w-full min-h-[1200px] md:min-h-screen  h-[200vh]  flex  justify-center items-center bg-navy relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="z-10 absolute top-0 left-0 mx-auto w-full min-h-screen h-full flex flex-col justify-center items-center text-center py-16 px-4 sm:px-6 gap-10 sm:gap-16 "
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false }}
            className="text-2xl xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl font-bold text-white flex w-[80%] sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto"
          >
            Real Results Through Member-Led Advocacy
          </motion.h1>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
            className="flex flex-col sm:flex-col  justify-center items-center w-full"
          >
            {news.map((item, index) => (
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.99 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                whileTap={{ scale: 1.05, transition: { duration: 0.1 } }}
                transition={{ duration: 0.3, delay: index * 0.07 }}
                viewport={{ once: false }}
                key={index}
                className="flex flex-col gap-2 items-center justify-center w-full sm:w-auto"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: false }}
                >
                  <Link
                    href={item.link}
                    className="text-base sm:text-base md:text-base font-medium text-white whitespace-pre-line text-center underline"
                  >
                    <span>{item.title}</span>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.ul>

          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-2xl xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl font-bold text-white flex w-[80%] sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto"
          >
            Influence, Intelligence, and Interaction
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            viewport={{ once: false }}
            className="text-base sm:text-base md:text-base font-medium text-white whitespace-pre-line text-center w-[80%] sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-[50%] mx-auto"
          >
            Success in India isn’t just about having a plan—it’s about having
            the right people on your side. We combine insight, influence, and
            on-the-ground support to help you make confident decisions and move
            faster. <br />
            <br /> Our team brings together account managers who understand your
            industry, policy experts who navigate complex regulations, and
            advisors with deep local knowledge. <br />
            <br /> Whether you’re exploring the market or scaling up, we’re here
            to make sure you have the clarity, access, and backing you need to
            succeed. <br />
            <br /> As a UKIBC member, you benefit from:
            <br />
            <br />
            <motion.ul
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: false }}
              className=" text-base sm:text-base md:text-base font-medium text-white whitespace-pre-line w-full md:w-screen mx-auto list-disc list-inside text-left"
            >
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                viewport={{ once: false }}
              >
                <b>Influence -</b> A stronger voice with government through our
                targeted advocacy work
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                viewport={{ once: false }}
              >
                <b>Intelligence - </b> Insights as advice, with ability to build
                brand on UKIBC social media.
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.38 }}
                viewport={{ once: false }}
              >
                <b>Interaction - </b> Access to senior political and business
                leaders at exclusive events
              </motion.li>
            </motion.ul>
          </motion.p>

          {/* <LiquidButton text="Membership" link="/membership" /> */}
        </motion.div>
      </BackgroundGradientAnimation>

      <Connect
        title="Connect with us"
        description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
        image="/connect.webp"
      />

      <div className="py-20 bg-black/5">
        <Carousel
          data={[
            {
              quote:
                "UKIBC is now at the forefront of their dialogue for sustainability and how energy transition is advancing and the technology benefits that can happen between the two countries.",
              name: "Nandita Sahgal-Tully",
              role: "Group Board Member UKIBC",
              image: "/home/testimonial/nandita.webp",
            },
            {
              quote:
                "Tata is a long-standing UKIBC member as we value the insights their excellent team provide and the interactions they curate with senior figures from business and government.",
              name: "Tim Jones",
              role: "Executive Director, Tata",
              image: "/home/testimonial/tim.webp",
            },
          ]}
        />
      </div>
    </>
  );
}
