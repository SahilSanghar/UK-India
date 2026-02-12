"use client";

import Lander from "@/components/Lander";
import Connect from "@/components/Connect";
import React from "react";

export default function page() {
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Privacy Policy",
          },
        ]}
        flip={true}
        currency={false}
        buttonTxt="Read more"
        buttonLink="#more"
        images={[{ image: "/books.jpg", position: "50%_50%" }]}
      />

      <section id="more" className="w-screen h-fit py-20">
        <p className="text-sm md:text-xl font-medium text-left text-black  xl:w-[60%] w-[90%] mx-auto my-20">
          UK India Business Council Limited is based at Alliance House, 12
          Caxton Street, London , SW1H 0QS. We may be contacted via the website,
          but we are also on Facebook, Twitter, and LinkedIn. We have a company
          in India as well, but all data collated in the UK are processed on
          UK-based systems, even by the Indian –based company staff. We may
          process “personal data” and/or “special category data” (as defined in
          UK data protection legislation, including UK GDPR) as part of our
          contracted services, membership services and/or our administration.
          Data may also be transferred overseas as part of this processing in
          limited circumstances. All feasible security measures are in place. We
          realise the importance of confidentiality. Data are held as long as
          they remain pertinent to the reasons for collection and/or if there is
          a statutory retention period.
          <br />
          <br />
          Any data transferred outside the UK-based systems are processed in
          accordance with the extant Indian Data Protection legislation and
          procedures. All security measures are defined by the UK Company.
          <br />
          <br />
          Data may be shared with third parties as part of our contracted
          services and/or if we are required by law to do so. “Third parties”
          may include specialist contractors we may include in specific projects
          for members. We cannot accept any liability for any processing
          conducted by a third party outside our remit.
          <br />
          <br />
          As part of our compliance, we have conducted a cookie audit on our
          website. Cookies are internet files used by the system to view
          websites and their content. We utilise Google cookies that the
          provider puts onto your system in the use of our map; YouTube cookies
          are placed on your system by YouTube in connection with the videos on
          our site. We cannot accept responsibility for these cookies as we have
          no control over their setting or use. You are at liberty to turn off
          cookies through your browser but you should be aware that this may
          affect your viewing experience.
          <br />
          <br />
          None of the above affects your rights under the legislation, in
          particular your right to access the data we hold on you. If you wish
          to request a copy of your data, please submit it in writing/email to
          the Company. Please include enough information to enable us to
          identify you and search for appropriate data.
          <br />
          <br />
          If you are dissatisfied with this policy, have queries about our data
          protection procedures or wish to lodge a complaint, please contact the
          company in the first instance. Thereafter you have the right to submit
          a complaint to the Supervisory Authority, the Information
          Commissioner’s Office (ICO):
          <br />
          <br />
          The Information Commissioner’s Office, Wycliffe House, Water Lane,
          Wilmslow, Cheshire, SK9 5AF
        </p>
      </section>

      <Connect
        title="Connect with us:"
        description="To connect with one of our India Experts simply email us or send us a message via our contact page. We look forward to connecting with you."
        image="/home/eyes/influence-1.png"
      />
    </>
  );
}
