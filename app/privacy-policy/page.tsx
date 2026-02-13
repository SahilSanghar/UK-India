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
          UK India Business Council India Pvt. Ltd. (UKIBC) is based at Alliance
          House, 12 Caxton Street, London, SW1H 0QS. We can be contacted via the
          website, but we are also on Facebook, Twitter, and LinkedIn. We also
          have a company in India. Still, all data collated in the UK is
          processed on UK-based systems, even by staff at the Indian–based
          company. We may process “personal data” and/or “special category data”
          (as defined in UK data protection legislation, including the UK GDPR)
          as part of our contracted services, membership services, and/or
          administration. Data may also be transferred overseas as part of this
          processing in limited circumstances. All feasible security measures
          are in place. We realise the importance of confidentiality. Data are
          retained as long as they remain pertinent to the reasons for
          collection and/or as required by a statutory retention period.
          <br />
          <br />
          Any data transferred outside the UK-based systems is processed in
          accordance with the extant Indian Data Protection legislation and
          procedures. The UK Company defines all security measures.
          <br />
          <br />
          Data may be shared with third parties as part of our contracted
          services and/or when required by law. “Third parties” may include
          specialist contractors we may include in specific projects for
          members. We cannot accept any liability
          <br />
          <br />
          for any processing conducted by a third party outside our remit.
          <br />
          <br />
          As part of our compliance, we have conducted a cookie audit on our
          website. Cookies are small files stored on your device by websites to
          help them function. We utilise Google cookies that the provider places
          on your system when you use our map, and YouTube cookies that YouTube
          places on your system in connection with the videos on our site. We
          cannot accept responsibility for these cookies as we have no control
          over their setting or use. You are at liberty to turn off cookies
          through your browser, but you should be aware that this may affect
          your viewing experience.
          <br />
          <br />
          None of the above affects your rights under the legislation, in
          particular your right to access the data we hold on you. If you wish
          to request a copy of your data, please submit it in writing/email to
          the company. Please include enough information to enable us to
          identify you and search for appropriate data.
          <br />
          <br />
          If you are dissatisfied with this policy, have queries about our data
          protection procedures or wish to lodge a complaint, please contact the
          company in the first instance. Thereafter, you have the right to
          submit a complaint to the Supervisory
          <br />
          <br />
          Authority, the Information Commissioner’s Office (ICO): The
          Information Commissioner’s Office, Wycliffe House, Water Lane,
          Wilmslow, Cheshire, SK9 5AF.
        </p>
      </section>

      <Connect
        title="Connect with us:"
        description="To connect with one of our India Experts, simply email us or send us a message via our contact page. We look forward to connecting with you."
        image="/home/eyes/influence-1.png"
      />
    </>
  );
}
