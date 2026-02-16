"use client";

import BoxImageText from "@/components/BoxImageText";
import Carousel from "@/components/Carousel";
import Connect from "@/components/Connect";
import Lander from "@/components/Lander";
import React from "react";

export default function page() {
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Membership Projects",
            des: "The UK India Business Council (UKIBC) team is committed to enhancing the trade and investment relationship between the UK and India, fostering a vibrant and equitable economic partnership that creates jobs and prosperity in both nations while serving as a force for global good.",
          },
        ]}
        button={false}
        images={[{ image: "/annual.jpg", position: "50%_50%" }]}
        flip={true}
      />

      <section
        id="more"
        className="w-full h-fit flex flex-col items-center justify-center pt-10 md:pt-20"
      >
        <h1 className="md:text-5xl text-2xl sm:text-3xl font-bold text-black mb-6 sm:mb-10 text-center w-full px-2">
          UKIBC Advocacy Wins
        </h1>
        <BoxImageText
          description={`The UKIBC works with our members and clients, namely UK and Indian businesses, and with the Government in both countries to promote trade and investment in the UK-India economic corridor. Our policy and advocacy efforts span multiple sectors, from higher education and food and drink to healthcare and beyond. We are uniquely connected to all levels of the UK and Indian Government, both national and local administrations. This gives us an unrivalled ability to advocate on behalf of our members’ interests towards delivering trade, investment, growth, and jobs.
 <br/><br/>Take a look at some of our advocacy wins below. <br/><br/> You can also read our <a href="/reports/uk-india-business-council-advocating-business-success-in-2020/" style="color: #012d6b; text-decoration: underline;">Advocacy Report for 2020</a>, which outlines the breadth of advocacy work that the UKIBC has delivered in the last twelve months and sets out our objectives and plans for 2020.  `}
          images={[
            { image: "/advocacy.webp", position: "50%_50%" },
            { image: "/comp.webp", position: "50%_50%" },
          ]}
        />
        <div className="md:w-[70%] w-[95%] flex flex-col text-center gap-6 sm:gap-10 mt-10 sm:mt-20 mb-6 sm:mb-10 bg-black/5 rounded-xl px-3 sm:px-10 py-6 sm:py-10">
          <h1 className="text-xl sm:text-2xl font-bold text-black md:w-[50%] w-full sm:w-[90%] mx-auto text-center">
            On FSSAI&apos;s publication of a clarification on standards for
            in-shell nuts (almonds)
          </h1>
          <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed text-justify sm:text-center">
            We warmly welcome the recent announcement by the Food Safety and
            Standards Authority of India (FSSAI), which represents a significant
            leap forward in improving the Ease of Doing Business (EoDB)
            landscape in India. The newly issued office order brings much-needed
            clarity to the regulatory framework governing in-shell nuts. This
            important directive confirms that in-shell nuts are to undergo
            testing in strict accordance with the standards set out in
            Sub-regulation 2.3.47(5) of the Food Safety and Standards Act, 2006.
            Furthermore, all FSSAI-recognised food testing laboratories have
            been officially instructed to align their testing procedures with
            these established guidelines, ensuring uniformity and minimising
            compliance-related uncertainties for industry stakeholders. This
            development is a commendable move toward simplifying regulatory
            processes, contributing to a more transparent and predictable
            business environment for the food industry. <br />
            <br />
            UKIBC submit recommendations to the GOI on behalf of the British
            industry amidst COVID-19 (March 2020)
            <br />
            <br />
            Given the unprecedented nature of COVID-19, practical measures were
            required to ensure essential goods and services continued to be
            delivered. Against this backdrop, the UKIBC, in consultation with
            its members and clients, identified a range of regulatory and
            practical issues being faced by businesses and which have been
            presented to the Government of India and to DIT India through
            several submissions and dialogues. <br />
            <br />
            <a
              href="/news/ukibc-submit-recommendations-to-government-of-india-to-support-business-in-relation-to-covid-19/"
              target="_blank"
              className="text-blue-500 underline"
            >
              UKIBC submit recommendations to the Government of India to support
              business in relation to COVID-19
            </a>
          </p>
        </div>

        <div className="w-full h-fit flex flex-col gap-6 sm:gap-10 mt-8 sm:mt-10 py-10 sm:py-20 items-center justify-center bg-black/5">
          {/* <h1 className="md:text-4xl md:w-[60%] w-[90%] mx-auto text-3xl font-bold text-black flex text-center justify-center items-center">
            Other advocacy wins and notable advocacy efforts
          </h1> */}

          <Carousel
            data={[
              {
                quote:
                  "The Food Safety and Standards Authority of India published standards for Alcohol-Free Beer (August 2020)",
                des: `The Government of India’s (GOI) Food Safety and Standards Authority of India (FSSAI) has issued a directive to operationalise certain provisions of the draft Food Safety and Standards (Alcoholic Beverages) Amendment Regulations, 2020. The provisions include adding alcohol-free beer as a separate product category. UKIBC, on behalf of the UK food and drink companies, engaged with FSSAI officials on several occasions, including on the publication of the alcohol-free beer.`,

                link: "/reports/uk-india-business-council-advocating-business-success-in-2020/",
                image: "/reports/1.webp",
              },
              {
                quote:
                  "UKIBC’s key recommendations included in India's National Education Policy 2020 (July 2020)",
                des: `Several UKIBC recommendations were cited in India’s National Education Policy 2020, including: <br/><li>Mutual recognition of qualifications</li><li>Simplification of the education regulatory framework</li>
                <li>Embracing online courses</li>
                <li>Integrating vocational training into mainstream education</li>
                <li>Greater international collaboration</li> <br> While the new policy was being drafted by the Kasturirangan Committee in 2018, UKIBC submitted these recommendations in two reports to the MHRD - <a href="/reports/indiaeducationpolicyreport/" style="color: #012d6b; text-decoration: underline;">‘India’s New Education Policy</a> and <a href="/reports/beyondthetop200/" style="color: #012d6b; text-decoration: underline;"> ‘Beyond the Top 200 – Effective International Collaboration for Indian Higher Education’</a> with these recommendations. <br>In addition, the policy aims to make all universities and colleges multidisciplinary by 2040, with a focus on holistic education, soft skills, and vocational training. UKIBC believes that to fulfil its growth potential and deliver employment outcomes, India's new education policy should be centred on the four key tenets of excellence, equal access, expansion, and employability.`,
                link: "/news/ukibc-submission-on-india's-new-national-education-policy ",
                image: "/reports/2.jpg",
              },
              {
                quote: "Expansion of FDI Limit in Defence (May 2020)",
                des: `As part of structural reforms across multiple sectors, the Government of India announced notable reforms in the defence sector. The stand-out announcement is that the foreign direct investment (FDI) limit in defence manufacturing under the automatic route has been raised from 49 per cent to 74 per cent.<br/><br/>
The UKIBC has long advocated for this reform, most recently in our 2020 Advocacy Report. We therefore welcome the forward-thinking announcement, which will benefit the sector by attracting further investment and technology into India, therefore supporting India’s Make in India strategy.<br/><br/>
The change appears to align with the newly proposed ‘Buy Global (Manufacture in India)’ category in the DPP 2020 and will make more cutting-edge technologies available to India’s defence forces. The move will also enhance R&D to develop and deploy solutions catering specifically to the country’s security needs.
<br/><br/>
`,
                image: "/reports/3.webp",
                link: "/news/government-of-india-raises-fdi-limit-in-defence-manufacturing/",
              },
              {
                quote: "Clarity on Graduate Immigration Route (April 2020)",
                des: `The UKIBC provided a voice for UK universities, calling for greater clarity from the Home Office on the new Graduate Immigration Route, which begins in 2021. In light of fears around students studying online due to COVID-19, at least for the initial months and potentially most of the first year of the 2020-21 academic year, the UKIBC asked the Home Office for clarity that students who studied online initially would still be eligible for the new GIR, which the Home Office subsequently provided.`,
                image: "/reports/4.webp",
                link: "/news/ukibc-continue-engagement-with-home-office-on-new-graduate-immigration-route/",
              },
              {
                quote:
                  "UKIBC submit recommendations to GOI on behalf of British industry amidst COVID-19 (March 2020)",
                des: `Given the unprecedented nature of COVID-19, practical issues were required to be addressed to ensure essential goods and services continue to be delivered. Against this backdrop, the UKIBC, in consultation with its members and clients, identified a range of regulatory and practical issues being faced by business and which have been presented to the Government of India and to DIT India through several submissions and dialogues.<br/><br/>
<a href="/news/ukibc-submit-recommendations-to-government-of-india-to-support-business-in-relation-to-covid-19/" style="color: #012d6b; text-decoration: underline;" target="_blank">ukibc submit recommendations to government of india to support business in relation to covid-19 </a>
`,
                image: "/reports/5.webp",
                link: "/news/ukibc-submit-recommendations-to-goi-on-behalf-of-british-industry/",
              },
              {
                quote: "Food and drink: Labelling requirements (January 2020)",
                des: `Following UKIBC’s repeated representations to the Food Safety and Standards Authority of India (FSSAI) on their stringent labelling requirements, the FSSAI have confirmed the inclusion of the rectifiable labelling requirement.<br/><br/>The FSSAI, to facilitate trade, permits rectification of labelling by affixing a single non-detachable sticker or by any other non-detachable method next to the principal display panel, without altering or masking the original label information in any manner.
<br/><br/>UKIBC has engaged with neutral allies and the FSSAI to secure this win for UK businesses exporting to India.`,
                image: "/reports/6.webp",
                link: "/news/ukibc-food-and-drink-advocacy-win-rectifiable-labelling-09c55c23",
              },
              // i am here
              {
                quote: "Drug pricing rise (December 2019)",
                des: `In December 2019, the National Pharmaceutical Pricing Authority (NPPA), India’s drug pricing regulator, increased the ceiling prices of 21 formulations by 50%<br/><br/>
This is a point for which the UKIBC has been advocating for since the launch of our report <a href="/reports/drug-pricing-in-india-regulations-to-foster-innovation-accessibility-and-affordability/" style="color: #012d6b; text-decoration: underline;">‘Drug Pricing in India: Regulation to foster innovation, accessibility and affordability‘</a>.<br/><br/>
The UKIBC has long made the point that drug pricing requires a careful balancing act. If the price is too low, innovation will be discouraged, and the availability of important medicines will be reduced. This announcement by the NPPA is a step in the right direction and will benefit the Indian healthcare system and those who depend on it.<br/><br/>
`,
                image: "/reports/7.webp",
                link: "/news/rise-in-drug-price-ceiling-in-india/",
              },
              {
                quote:
                  "Indian Government to cut Corporate Tax Rate (CTR) from 30% to 25.17% (September 2019) ",
                des: `The UKIBC has long advocated to the Government of India, including at a meeting with India’s Minister of Commerce and Industry, Mr. Piyush Goyal, in London in July 2019, for India to cut its corporate tax to a more competitive rate in line with major economies. Our report, <a href="/reports/how-the-uk-can-make-in-india-growing-uk-advanced-manufacturing-and-engineering-investment-in-india/" style="color: #012d6b; text-decoration: underline;"> ‘How the UK can Make in India’ </a>, set-out measures the Government of India should take to attract more foreign direct investment (FDI) from the UK manufacturing FDI.<br/><br/>
The introduction of this more globally-competitive tax rate will have a positive impact, not just for the major manufacturers, but all the way through the supply chains as businesses will now be able to reinvest more of their profits in innovation and expansion.<br/><br/>
`,
                link: "/news/ukibc-welcomes-indian-corporate-tax-rate-reduction/",
                image: "/reports/8.webp",
              },
              {
                quote:
                  "Reinstatement of UK post-study working visa for two years (September 2019)",
                des: `The UKIBC have consistently advocated for this visa extension through events and submissions to the UK Government. This is in addition to <a href="/news/ukibc-gives-evidence-to-new-parliamentary-international-student-report/" style="color: #012d6b; text-decoration: underline;" target="_blank">evidence we submitted to the UK Parliament’s All Party Parliamentary Group (APPG)</a> on International Students in 2018, advocating for post-study working visa reform to support the UK-India relationship and ‘living bridge’.<br/><br/>
Not only does the reinstatement of two years improve the competitiveness of the UK’s education offer on the world stage, but it also rightly encourages many of the best Indian graduates of UK universities to retain their talent within the UK. In turn, this provides new graduates with an opportunity to gain work experience after their degrees and secure employment.
`,
                link: "/news/uk-government-backs-ukibcs-call-for-international-post-study-visa-extension/",
                image: "/reports/9.webp",
              },

              {
                quote:
                  "UKIBC-led CEO round table in the state of Maharashtra leads to advocacy win in the drink sector (January 2019)",
                des: `A roundtable in January 2019 in Mumbai, involving the Maharashtra Chief Minister and CEOs from UKIBC members, directly led to the establishment of a Task Force, which held 32 follow-up meetings with relevant officials under the leadership of the Maharashtra Principal Secretary.<br/><br/>
Around 75 recommendations were made to the Task Force, and the Government issued 30 notifications/circulars to introduce large-scale simplification of procedures, the delegation of powers, and the removal of documents in the regulatory ecosystem, including:
<br/><br/>

  <ul style="list-style-type: disc; padding-left: 1.5rem;">
    <li>The “Bottled in Origin” label registration process: Brand owners now need just a single registration</li>
    <li>Timeline-based services for the renewal of licenses and label registration of new brands</li>
    <li>Delegation of power: extended approval power to the local excise officials to expedite the approval process</li>
    <li>Extended dispatch: operating units can now dispatch between 8 AM – 8 PM</li>
    <li>Extended unit operation: the local excise can now take the decision to allow units to operate on multiple shifts and longer hours</li>
  </ul>
`,

                image: "/reports/10.jpg",
              },
              {
                quote:
                  "Law Commission Report recommending the legalisation and regulation of sports betting and gaming (July 2018)",
                des: `In 2018, the Law Commission of India submitted a comprehensive, pragmatic legal framework to the Government, recommending the regulation of gambling and sports betting.<br/><br/>
The recommendations were developed after several rounds of stakeholder consultations and input. We are delighted that the UKIBC and UK industry were closely engaged in the process, including hosting the Law Commission Chairman in the UK, providing insights into how the UK regulates sports betting.<br/><br/>
We believe this move is positive for protecting the integrity of sport, stamping out corruption, expanding the tax base, and stimulating greater investment and job creation in the Indian economy.
`,
                link: "/news/is-this-the-beginning-of-the-end-for-match-fixing-in-india/",
                image: "/reports/11.webp",
              },
            ]}
          />
        </div>
        <div className="w-full h-fit flex flex-col items-center justify-center bg-black/5 pb-10 sm:pb-20 ">
          <h1 className="md:text-4xl md:w-[50%] w-full sm:w-[90%] mx-auto text-2xl sm:text-3xl font-bold text-black flex text-center justify-center items-center mb-6 sm:mb-10">
            Other advocacy wins and notable advocacy efforts
          </h1>

          <Carousel
            data={[
              {
                quote:
                  "Government of India act upon UKIBC recommendations pertaining to financial services (June 2020)",
                des: `Following submissions by the UKIBC to DPIIT and Invest India, as well as to the Reserve Bank of India and the Small Industries Development Bank of India, the Government of India has taken several positive steps to support companies facing liquidity constraints and lockdown restrictions.
`,
                link: "/news/government-of-india-act-upon-ukibc-recommendations-pertaining-to-financial-services/",
                image: "/reports/12.webp",
              },
              {
                quote:
                  "Submission to MeitY and DoT on the importance of digital (May 2020) ",

                des: `In May 2020, the UKIBC made a submission to the Ministry of Electronics and Information Technology (MeitY) and the Department of Telecom (DoT). This submission highlights the importance of a diverse, vibrant, and robust tech sector that can be drawn on to provide expertise and delivery capabilities to governments and citizens across sectors, and the need for collaboration between Governments and the tech sector.`,
                link: "/news/ukibc-submission-to-meity-on-the-importance-of-digital/",
                image: "/reports/13.webp",
              },
              {
                quote:
                  "UKIBC recommendations to Indian MOD on draft DPP 2020 (May 2020)",
                des: `On 20th March 2020, the Indian Ministry of Defence released its draft Defence Procurement Procedure (DPP) 2020 for industry comment and recommendations. Following extensive surveying and information gathering from British business, via its Aerospace & Defence Industry Group, UKIBC submitted consolidated feedback on the draft to the Government of India on 8th May 2020.`,
                link: "/news/ukibc-recommendations-to-indian-mod-on-draft-dpp-2020/",
                image: "/reports/14.webp",
              },
              {
                quote:
                  "UKIBC write to MHRD to collaborate with UK in online learning (April 2020)",
                des: `The coronavirus lockdown has led educational institutions across the country to temporarily close, increasing demand for online learning. Universities and colleges worldwide are working to migrate all courses and curricula to digital platforms as quickly as possible to minimise disruption to students’ education.  Accordingly, the UKIBC wrote to the Ministry of Human Resource Development (MHRD) on behalf of our members, offering practical recommendations to support their efforts.`,
                link: "/news/ukibc-write-to-mhrd-to-collaborate-with-uk-in-online-learning/",
                image: "/reports/15.webp",
              },
            ]}
          />
        </div>
      </section>

      <Connect
        title="Connect with Us"
        description="We're here to help you with your projects. Get in touch with us today."
        image="/connect.webp"
      />
    </>
  );
}
