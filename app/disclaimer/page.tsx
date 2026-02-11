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
            title: "Disclaimer",
          },
        ]}
        flip={true}
        currency={false}
        buttonTxt="Read more"
        buttonLink="#more"
        images={[{ image: "/books.jpg", position: "50%_50%" }]}
      />

      <section id="more" className="w-screen overflow-hidden h-fit py-20">
        <div className="flex flex-col items-center justify-center bg-navy/10 rounded-xl shadow-lg p-4 sm:p-8 mb-8 w-[95vw] max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-blue-700 font-semibold mb-2">
            Notice
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-navy mb-1 text-center">
            Important Notice to the General Public
          </h1>
          <span className="text-sm text-navy/80 font-medium">by</span>
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="inline-block bg-navy text-white text-base font-bold px-3 py-1 rounded-lg">
              UK India Business Council (UKIBC)
            </span>
          </div>
        </div>

        <p className="text-sm md:text-xl font-medium text-left text-black  xl:w-[60%] w-[90%] mx-auto my-20">
          This is to inform the general public that fraudsters in the guise of
          offering services in the name of the UK India Business Council
          (“UKIBC”) are extracting monetary benefits from the general public. We
          would like to inform you that UKIBC does not contact the public via
          unsolicited calls or emails asking for money or any other type of
          personal information. UKIBC is not connected, associated, or
          affiliated in any manner whatsoever with such fraudsters &
          impersonators. All members of the public and stakeholders are
          requested to accordingly take note, exercise due diligence and not
          fall prey to frauds or swindles perpetrated by individuals who
          impersonate to be employees of the UKIBC.
          <br />
          <br />
          The fraudsters send attractive fictitious offers to the public through
          letters and e-mails using false imitations of the letterhead of the
          UKIBC and purportedly signed by individuals impersonating to be
          executives/senior officials of the UKIBC. The victims are thereafter
          persuaded by the fraudsters to deposit money in fraudulent bank
          accounts towards membership registration with the assurance that they
          will receive certain assured monetary benefit, inter alia, in the form
          of investments from companies situated outside of India. We reiterate
          that our organisation neither collects money from the general public
          towards membership nor promises any kind of such monetary benefit.
          <br />
          <br />
          The members of the public are suggested to seek legal advice and/or
          approach the local law enforcement agencies.
          <br />
          <br />
          The information on our company, products and business activities is
          available on our official website{" "}
          <a
            href="https://www.ukibc.com/"
            className="text-blue-500 hover:underline"
          >
            https://www.ukibc.com/
          </a>
          .
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
