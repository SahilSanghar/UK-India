"use client";

import Lander from "@/components/Lander";
import React from "react";
import Person from "@/components/Person";
import Connect from "@/components/Connect";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface GroupBoardProps {
  title: string;
  job_title: string;
  image: string;
  sort: string;
  content: string;
}

export default function Page() {
  const groupBoard = [
    {
      name: "Richard Heald, OBE",
      role: "Group Chair - UK India Business Council",
      image: "/group-board/richard.webp",
      des: "Richard Heald is the UK India Business Council (UKIBC) Chair since 2022. Prior to this he was its Chief Executive Officer for 10 years during which time the UKIBC has evolved into a deliverer of sector focused policy advocacy and consultancy to members, stakeholders, and major corporates as well as a full provider of trade and investment services to Indian and UK companies operating in the UK India economic corridor with offices in India. <br /><br /> A career investment banker, he enjoyed over 30 years’ experience of the international financial markets, 20 years of which has been focused on advisory and capital raisings for governments and major corporate across the globe. Latterly, Richard had a 17-year career at Rothschild culminating in acting as Vice Chairman, Rothschild, India with associated responsibilities across Southeast Asia and a Partner of Rothschild. He retains extensive relationships across the region. <br /><br /> In addition to his chairmanship of UKIBC he is a Managing Director of Essar Energy Transition and a non-executive Director of TVS SCS Ltd. <br /><br /> Richard was awarded an OBE in the 2016 Queen’s Birthday Honours for services to economic and trade relations between the UK and India.",
    },
    {
      name: "Nandita Sahgal-Tully",
      role: "Independent",
      des: "Nandita has 25 years’ emerging markets experience working in investment management, equity capital markets and M&A at ThomasLloyd Group, Insinger de Beaufort and Seymour Pierce. Previous senior roles include Head of M&A at ThomasLloyd Group and prior to that, Chief Executive Officer at IL&FS Global Financial Services (UK) Ltd., the UK subsidiary of the investment banking arm of IL&FS, an Indian financial Institution focused on infrastructure development. <br /><br /> Nandita has been on the Board of the UKIBC for 9 years and is Chair of the Audit Committee and Senior Independent Director. She holds a Bachelors in Economics and Business from The University of Edinburgh, is a Fellow of the Institute of Chartered Accountants in England and Wales (ICAEW) and a Member of the Chartered Institute for Securities and Investment. <br /><br /> Nandita is based in London but travels regularly to India on business and pleasure. Her UK/India connection extends to her husband Sam Tully who is a Director of UK Business Development at Quantum Advisors and son of Sir Mark Tully, veteran India Bureau Chief for the BBC.",
      image: "/group-board/nandita.webp",
    },
    {
      name: "Kishore Jayaraman, OBE",
      role: "UKIBC Group CEO",
      image: "/group-board/kishore.webp",
      des: "Kishore Jayaraman is President for Rolls-Royce India and South Asia. Since taking over the role ten years ago, Kishore has been instrumental in driving strategic focus and significant expansion across the Rolls-Royce Civil Aerospace, Defence and Power Systems businesses. <br /><br /> A strong proponent of technology innovation, he led the establishment of Rolls-Royce’s digital and engineering capabilities in India that now contribute significantly to global development projects. He also leads the growth of the company’s manufacturing and sourcing footprint in India through joint ventures with Hindustan Aeronautics Limited and Force Motors, as well as other key partnerships. <br /><br /> Prior to joining Rolls-Royce, Kishore held diverse leadership roles across markets at GE for 23 years, and his last assignment was as President and CEO of GE Energy, South Asia. Based in New Delhi, India, Kishore serves on several boards and is at the helm of industry committees and associations, whilst being a champion for sustainability and strategic ecosystem evolution for the present and future. <br /><br /> Kishore was recently awarded an honorary Officer of the Order of the British Empire (OBE) by Her Majesty The Queen for services to international trade and investment, with a key focus on promotion of India-UK trade.",
    },
    {
      name: "Philip Bouverat",
      role: "Director of Global External Affairs - JCB",
      image: "/group-board/philip.png",
      des: "JCB is a British multinational manufacturer of equipment for construction, agriculture, waste handling, and demolition, founded in 1945 and based in Rocester, Staffordshire, England. Today, JCB has some of the finest engineering facilities across the globe, produces a range of over 300 machines and maintains a reputation for unrivalled customer service. <br /><br /> Philip Bouverat is a multi-disciplined executive with a broad range of international market entry experience including mergers, acquisitions, joint ventures, and listings.  Having travelled extensively on a global basis, he has dealt with numerous hands-on international trade and finance scenarios, specializing in infrastructure solutions.  A passion for British manufactured products and international trade has placed him in a valued position by successive Governments, participating on vital trade missions with Prime Ministers and Ministers, to numerous countries over the last twenty years. <br /><br /> Philip joined JCB in 2002 to bring the Chinese market into JCB’s global strategy. Currently based in London covering international diplomatic liaison, with particular emphasis on India and Global account relations; including Business Development and strategy approach to HVO’s. He is a founding Director of the UK India Business Council, China-Britain Business Council, and Chairs The Infrastructure Group. He was a founder member of the UK Gov Asia Task Force and now sits on the Board of the ASEAN Council, founder Director of the Commonwealth Enterprise and Investment Council.  Serves on the Jordanian Task force and JETCO for India and Brazil. <br /><br /> He is the architect of the newly formed IE:UK Infrastructure Export UK and sits on the Board of Directors advising the Department for Business and Trade on Global Project Strategy, chaired by DBT Minister.",
    },
    {
      name: "Professor Christine Ennew, OBE",
      role: "Independent",
      image: "/group-board/christine.png",
      des: "Christine has extensive experience of academic leadership, domestically and internationally. Her international education experience has focused primarily on Asia including Malaysia, India and China. <br /><br />For 7 years, she was Provost at the University of Warwick where she led the development and delivery of the University’s academic strategy. She was responsible for all aspects of academic performance with a particular focus on finances, human resources and space. She also provided leadership in relation to recruitment/admissions, online/distance delivery, EDI/inclusion and sustainability. <br /><br /> Before joining Warwick, she was Provost at the University of Nottingham Malaysia Campus with responsibility for all aspects of campus strategy and operations, both academic and non-academic. She spent 5 years as Pro Vice Chancellor at the University of Nottingham and 3 years as Dean of Social Sciences.",
    },
    {
      name: "Jagbir Singh Sidhu",
      role: "Corporate Affairs Officer - Diageo India",
      image: "/group-board/jagbir.png",
      des: `Jagbir leads the Corporate Affairs function at Diageo India and is a member of its Executive Committee. His responsibilities include Regulatory and Trade matters related to Alcohol Policy, Market Access, Corporate Communications & Reputation and programs to address alcohol misuse, champion responsible consumption and deliver Social Impact.<br /><br />Jagbir has an outstanding track record of over 25 years in the alcohol-beverage industry. An experienced business leader, Jagbir has spearheaded several transformative initiatives across sales and marketing through a deep and strategic understanding of consumer dynamics.<br /><br />Earlier, Jagbir was Executive Vice President and Chief Operating Officer, North and West Region, Diageo India. Under his leadership, Diageo India witnessed strong double-digit growth, high market share gains and robust brand equity in both the regions by shaping the business strategy, re-engineering internal systems and enhancing delivery in these regions. In addition, he fostered the premiumisation agenda for Diageo India’s scotch portfolio by driving a bold mission supported by an entrenched route to market.<br /><br />Prior to Diageo, Jagbir worked with Pernod Ricard India where he held key leadership roles across Commercial, Marketing and International Business Development including the mandate for their power brands; as well as the market strategy for their international brands in India. He also led the business delivery for North, West and Canteen Stores Department (Ministry of Defence) and East Zones.<br /><br />Jagbir is on the board of UK- India Business Council.`,
    },
    {
      name: "David Nisbet",
      role: "Independent",
      image: "/group-board/david.png",
      des: `David has three decades experience advising and working with Boards of Directors.<br /><br />He was with London listed Cairn/Capricorn Energy PLC for twenty years, leading stakeholder engagement to support corporate strategy, with extensive understanding of capital markets, global investors, governments, international financial media, employees and business partners.<br /><br />Much of his time has been spent conducting business in India, where Cairn was involved in one of the country’s biggest ever IPO’s and cross border M&A transactions, along with resolving a long-standing tax issue that led to a change in law and refund of more than $1 billion.<br /><br />David is a Senior Advisor for Rothschild and Co, Global Advisory, and a Board Member for the Winning Scotland Charity.`,
    },
    {
      name: "Avinash Vazirani",
      role: "IndeFund Management Director - Jupiter Asset Management",
      image: "/group-board/avinash.png",
      des: `Avinash Vazirani is a fund manager at Jupiter Asset Management, where he manages India dedicated funds — a role he has undertaken since 1995. He joined Jupiter in 2007.<br /><br />Previously, Avinash worked for BNP Paribas Asset Management before founding Peninsular Capital Partners, an investment management firm focused on equity assets in the Indian sub-continent.<br /><br />Prior to that, he served as CEO of GEM Dolphin Investment Managers, a joint venture fund management company. During this tenure, he launched and managed the South Asia Access Fund and South Asia Value Fund, one of the first India dedicated offshore funds, in 1995.<br /><br />Avinash is a chartered accountant and was a Senior Manager at Price Waterhouse before leaving in 1992 to lead the management buy-in of John Lusty Group plc, a publicly quoted food manufacturer and distributor, where he served as Chief Operating Officer until the company’s sale in 1994.<br /><br />He is a Trustee of The London Clinic and a former Trustee and Chair of Pratham (UK), a charity focused on children’s education in India.`,
    },
    {
      name: "Alexander Ehmann",
      role: "DIRECTOR OF UK PUBLIC AFFAIRS - TATA LIMITED",
      image: "/group-board/alexander.png",
      des: `Alexander leads Tata Sons’ public policy engagement in the UK.  This includes extensive engagement with the Government, parliamentary and Civil Service stakeholders.<br /><br />An expert in business policy, including regulation, enterprise support and employment law. Alexander served for seven years as a ministerial appointment to the Government’s regulatory watchdog, the Regulatory Policy Committee.<br /><br />Alexander has significant experience of a wide range of industrial sectors, including manufacturing, consumer goods, aerospace, defence, automotive and energy.<br /><br />Prior to joining Tata, Alexander worked as the Deputy Director of Policy for the Institute of Directors where he led a range of policy responses and thought leadership initiatives for the organisation’s membership.    He was also a leading media spokesperson and commentator for the organisation.<br /><br />Alexander has been a local government Councillor for the London Borough of Richmond upon Thames since 2014, where he leads the Council’s work on Transport and Air Quality. He has served as a School Governor and Trustee for various organisations.<br /><br />Alexander is on the board of UK-India Business Council.`,
    },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["group-board"],
    queryFn: () =>
      axios.get("/api/admin/group_board").then((res) => res.data.groupBoard),
  });
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Group Board",
            des: "The UK India Business Council (UKIBC) Group Board is a prestigious assembly of senior leaders and influential figures committed to enhancing the bilateral trade and investment landscape between the UK and India.",
          },
        ]}
        flip={true}
        button={false}
        images={[{ image: "/group-board.webp", position: "50%_50%" }]}
      />

      <div className="w-full h-full flex flex-col justify-center items-center py-20">
        <p className=" md:text-lg  text-base font-medium leading-relaxed xl:w-[50%] md:w-[70%] w-[90%] mx-auto text-justify mb-10">
          This diverse board comprises industry experts, business leaders,
          academia and policymakers who collaborate to drive strategic
          initiatives and foster meaningful partnerships across sectors.
          <br /> <br />
          The Group Board’s primary mission is to provide oversight and
          strategic direction for UKIBC’s activities, ensuring that the
          organisation effectively addresses the evolving needs of businesses
          operating in both markets. Board members leverage their extensive
          experience and networks to facilitate high-level dialogues, advocate
          for policy reforms, and identify emerging opportunities that promote
          sustainable growth and innovation.
        </p>
        <h1 className="md:text-4xl text-2xl text-navy font-bold text-center mb-10">
          Group Board
        </h1>
        <div className="w-[80%] mt-10 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-0 gap-y-10  items-start justify-items-start justify-center mx-auto">
          {data
            ?.sort((a: GroupBoardProps, b: GroupBoardProps) => {
              const aSort = a.sort ?? "";
              const bSort = b.sort ?? "";

              if (aSort < bSort) return -1;
              if (aSort > bSort) return 1;
              return 0;
            })
            .map((item: GroupBoardProps, index: number) => (
              <Person
                name={item.title}
                role={item.job_title}
                theme="dark"
                image={item.image}
                des1={item.content}
                key={index}
              />
            ))}
        </div>
      </div>

      <Connect
        title="Connect with us:"
        description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
        image="/connect.webp"
      />
    </>
  );
}
