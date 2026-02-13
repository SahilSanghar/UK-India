"use client";
import React from "react";
import Lander from "@/components/Lander";
import BoxImageText from "@/components/BoxImageText";
import Connect from "@/components/Connect";
import Carousel from "@/components/Carousel";
export default function page() {
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Higher Education Advisory",
            title2:
              "How UKIBC Supports UK Universities with Recruitment in India",
            des: "India is one of the strongest growth markets for UK higher education, spanning student recruitment, academic partnerships and government–industry engagement. But meaningful impact demands in-country presence, cultural fluency and strategic focus. UKIBC’s Launchpad places skilled staff on the ground, backed by local experts, to scale recruitment, strengthen admissions and build high-impact partnerships.",
          },
        ]}
        flip={true}
        button={false}
        images={[
          { image: "/hea.webp", position: "50%_50%" },
          { image: "/heaa2.webp", position: "50%_50%" },
        ]}
      />
      <BoxImageText
        title="Result-Driven Recruitment"
        description={`India is a leading source of international students and a key market for UK universities. Launchpad™ enables focused student recruitment in India and sustainable long-term branding.
          <br><br> <b> PRESENCE– </b> A dedicated in-country team offers last-mile connectivity with predictable costs you control. Our specialists exclusively represent you, supported by experts who understand India’s education ecosystem, government linkages and industry–academia trends. This builds trust and positions your institution as a future-focused partner.
<br> <b> DELIVERY– </b> Strategy and execution seamlessly integrated for faster results. Mature Market Access, 85% of Indian students pursue postgraduate study, and manage and grow agent networks with targeted outreach recruitment campaigns.
<br> <b> INSIGHT– </b> Unlock undergraduate potential through our Direct2Student campaign, connecting you with top schools and counsellors nationwide. These channels help institutions thrive through stronger ideas, networks and on-ground impact.`}
        // buttonText="Meet our student recruitment experts"
        // buttonLink="/team?filter=business_solutions"
        className="mt-20"
        images={[
          { image: "/hea-result.webp", position: "50%_50%" },
          { image: "/hea-result2.webp", position: "50%_50%" },
        ]}
      />
      <BoxImageText
        title="Partnership Pathways"
        description={`Build deep, strategic relationships. Identify, develop, and manage opportunities for academic, industry, or government partnerships aligned to your institutional goals.
          <br><br> <b> PRESENCE – </b> A dedicated partnership lead represents your institution on the ground, ensuring last-mile connectivity. This local presence helps identify and nurture collaborations efficiently, so you save time and build meaningful, high-value connections powered by trust.
<br> <b> ACCESS - </b> Open doors to the right people and opportunities across ecosystems. Navigate academia, corporates, and government smoothly, fast-tracking co-creation initiatives through UKIBC’s curated network. This acts as a catalyst for trade, investment, and long-term collaboration.
<br> <b> IMPACT – </b> We help clients shape valuable partnerships across three areas:
<br> <br>
<li> <b> Academia: </b> Twinning and joint degrees, co-developed curriculum, faculty exchange, PhD sponsorships, and joint research that bring institutions and industries closer.</li>
<li> <b> Industry: </b>  R&D and innovation partnerships, executive training, consultancy, and employability programmes that help students thrive.</li>
<li> <b> Government: </b> Strategic MoUs, policy research, pilot projects with central and state bodies, and initiatives addressing societal challenges — connecting all three sectors through ideas, networks, and measurable impact.</li> `}
        buttonText="Transnational Education (TNE)"
        buttonLink="/tne"
        className="mb-10 mt-10"
        images={[
          { image: "/hea-partner.webp", position: "50%_50%" },
          { image: "/hea-partner2.webp", position: "50%_50%" },
        ]}
      />
      <BoxImageText
        title="Agile Admissions"
        description={`India’s competitive education market demands speed, accuracy, and local intelligence in admissions. UKIBC’s Launchpad™ enables you to process applications faster, with full control and confidence.
          <br><br> <b> LAST MILE ACCESS – </b>  Find a local admissions team fully aligned with your processes, exclusively for your university, operating under your protocols to extend your capacity without increasing your internal workload.
<br> <b> SPEED  - </b> Be the first to offer — and first to convert. 46% of Indian students pay deposits to the first university that makes an offer. Our rapid response model accelerates processing and boosts enrolments.
<br> <b> INTEGRITY  – </b>  Quality control, insight, and fraudulent application protection. Daily reporting, ground-level insights, and early fraud detection help you stay compliant, informed, and ahead of the curve.
 `}
        // buttonText="Meet our admission support experts"
        // buttonLink="/team?filter=business_solutions"
        className="mb-20"
        images={[
          { image: "/hea-agile.webp", position: "50%_50%" },
          { image: "/hea-agile2.webp", position: "50%_50%" },
        ]}
      />

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
                "UKIBC play a key role in supporting increasing bilateral trade between the UK and India in all sectors, including education.",
              name: "Caroline Baylon",
              role: "Director - International, University of Bristol",
              image: "/home/testimonial/carol.webp",
            },
            {
              quote:
                "Setting up a dedicated Admission team within UKIBC was a game changer for UEA. It not just improved efficiency and conversion, but it also helped enormously to build our credibility in the market, especially with agents and students.",
              name: "Karen Blackey",
              role: "Head of International Office, University of East Anglia",
              image: "/home/testimonial/karen.webp",
            },
          ]}
        />
      </div>
    </>
  );
}
