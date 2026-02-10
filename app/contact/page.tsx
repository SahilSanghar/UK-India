"use client";

import Lander from "@/components/Lander";
import React from "react";

export default function page() {
  return (
    <>
      <Lander
        title_data={[
          {
            title: "Contact us",
            title2: "Have a query? Feel free to reach out!",
          },
        ]}
        flip={true}
        currency={false}
        button={false}
        buttonTxt="Know more"
        buttonLink="#more"
        images={[{ image: "/contacthome.png", position: "50%_50%" }]}
      />

      <section id="more" className="w-screen h-fit py-20">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center text-center">
          <h1 className="md:text-4xl text-2xl font-bold text-navy">
            Boosting trade, investment and technology collaboration
          </h1>
          <p className="md:text-lg text-sm font-medium leading-relaxed md:w-full w-[90%] text-center m-auto ">
            Whether you are seeking to forge new partnerships, unlock
            opportunities, or simply explore how we can support your journey,
            our team at UKIBC is here to guide you every step of the way. Reach
            out to us, and together let us shape a brighter, more prosperous
            future.
          </p>
        </div>

        <form
          action=""
          className="w-[90%] md:w-1/2 bg-mix2/10 border-mix border-2 p-10 rounded-4xl mx-auto flex flex-col gap-8 items-center justify-center text-center my-20"
        >
          <div className="w-full flex flex-col gap-4">
            <p className="md:text-4xl text-2xl font-bold text-navy text-left">
              Send Us an Enquiry
            </p>
            <div className="flex flex-row gap-4">
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Second Name"
                name="secondname"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <input
              type="text"
              placeholder="Company"
              name="company"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Location"
              name="location"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="w-full flex flex-col gap-2 text-left">
              <p>How can you assist?</p>
              {/* dropdown */}
              <select
                name="assistance"
                id="assistance"
                className="w-full p-2 border bg-mix2 border-gray-300 rounded-md focus:outline-none transition duration-150"
              >
                <option value="none">None</option>
                <option value="influence">Influence</option>
                <option value="interaction">Interaction</option>
                <option value="intelligence">Intelligence</option>
                <option value="interact">Interact</option>
                <option value="membership">Membership</option>
                <option value="events">Events</option>
                <option value="other">Other</option>
              </select>
            </div>
            <textarea
              name="message"
              id="message"
              placeholder="Optional Message"
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
            <button
              type="submit"
              className="w-full p-2 bg-navy text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="mt-16 w-full flex flex-col  mx-auto">
          <h2 className="md:text-4xl text-2xl font-bold text-navy mb-10 text-center">
            Our Offices
          </h2>

          <div className="flex md:flex-row flex-col md:gap-10 gap-5 justify-center  mx-auto">
            {/* London Office */}
            <div className="mb-10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.788260999468!2d-0.13805322338045375!3d51.498752971811385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604deaf3a390d%3A0x63f447e8b8044edb!2sAlliance%20House%2C%2012%20Caxton%20St%2C%20London%20SW1H%200QL%2C%20UK!5e0!3m2!1sen!2sin!4v1767441708319!5m2!1sen!2sin"
                width="200"
                height="200"
                style={{ border: "0" }}
                allowFullScreen
                loading="lazy"
                className="rounded-4xl"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <h3 className="text-lg font-bold my-2">London</h3>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-navy"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 16.92V21a1 1 0 01-1.09 1A19.75 19.75 0 013 5.09 1 1 0 014 4h4.09a1 1 0 011 .78l1.06 4.48a1 1 0 01-.27.95l-2.2 2.2a16 16 0 006.6 6.6l2.2-2.2a1 1 0 01.95-.27l4.48 1.06a1 1 0 01.78 1V16.92z"
                    />
                  </svg>
                  <a
                    href="tel:+4402075923040"
                    className="text-[15px] text-blue-500 hover:underline"
                  >
                    +44 (0)20 7592 3040
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-navy"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16.5 9.4l-4.528 4.528a.75.75 0 01-1.061 0L5.5 9.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <a
                    href="mailto:enquiries@ukibc.com"
                    className="text-[15px] text-blue-500 hover:underline"
                  >
                    enquiries@ukibc.com
                  </a>
                </div>
                {/* <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-navy"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 10.5a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <a
                    href="https://maps.google.com/?q=12+Caxton+Street,+London+SW1H+0QS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] text-blue-500 hover:underline"
                  >
                    Find us on Google Maps
                  </a>
                </div> */}
              </div>
              <div className="text-[15px] mb-1 leading-tight">
                UK India Business Council
                <br />
                Alliance House;
                <br />
                12 Caxton Street;
                <br />
                London
                <br />
                SW1H 0QS
              </div>
            </div>

            {/* New Delhi Office */}
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.7504179131547!2d77.09835489999999!3d28.456939100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1960a73c4b73%3A0xeb5fd926a85a5ca!2sSmartworks%20Golf%20View%20Towers!5e0!3m2!1sen!2sin!4v1767442016633!5m2!1sen!2sin"
                width="200"
                height="200"
                style={{ border: "0" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-4xl"
              ></iframe>
              <h3 className="text-lg font-bold my-2">New Delhi</h3>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-navy"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5h2l3.6 7.59a1 1 0 01.13.41c0 .14-.05.27-.13.41l-1.35 2.44A1 1 0 007 18h10m0 0a2 2 0 100-4 2 2 0 000 4zm-9-2h8"
                    />
                  </svg>
                  <a
                    href="tel:+911245026059"
                    className="text-[15px] text-blue-500 hover:underline"
                  >
                    +91 (0) 124 502 6059
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-navy"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16.5 9.4l-4.528 4.528a.75.75 0 01-1.061 0L5.5 9.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <a
                    href="mailto:enquiries@ukibc.com"
                    className="text-[15px] text-blue-500 hover:underline"
                  >
                    enquiriesindia@ukibc.com
                  </a>
                </div>
              </div>
              <div className="text-[15px] mb-1 leading-tight">
                UK India Business Council
                <br />
                Smartworks, 2nd Floor
                <br />
                Tower-B,
                <br />
                Golf view Towers
                <br />
                Sector 42, Gurugram,
                <br />
                Haryana 122002
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
