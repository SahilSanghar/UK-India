"use client";

import Lander from "@/components/Lander";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface PageProps {
  id: string;
  title: string;
  type: string;
  lander: {
    title: string[];
    title2?: string[];
    des: string[];
    image: string[];
    flip: boolean;
    button: {
      enable: boolean;
      text: string;
      link: string;
    };
  };
  stats?: {
    title: string;
    cards: {
      title: string;
      valueBefore: string;
      valueAfter: string;
      number: number;
      des: string;
      disclaimer: string;
      link: string;
    }[];
    circle?: {
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
  fullscreen?: {
    title: string;
    des: string;
  };
  box?: {
    title: string;
    content: string;
    buttonTxt: string;
    link: string;
    image: string[];
  }[];
  contact?: {
    title: string;
    content: string;
    image: string;
  };
  locations?: {
    title: string;
    address: string;
    phone: string;
    email: string;
    src: string;
  }[];
}

export default function ContactPage({ page }: { page: PageProps }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const isSubmitting = useRef(false);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isSubmitting.current) {
        e.preventDefault();
        e.returnValue =
          "Your enquiry is being submitted. If you leave now it may not be received.";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    isSubmitting.current = true;

    const form = e.currentTarget;
    const body = {
      firstname: (form.elements.namedItem("firstname") as HTMLInputElement).value,
      lastname: (form.elements.namedItem("lastname") as HTMLInputElement).value,
      organization: (form.elements.namedItem("organization") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      location: (form.elements.namedItem("location") as HTMLInputElement).value,
      assistance: (form.elements.namedItem("assistance") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await axios.post("/api/enquiry/contact", body);
      if (res.status !== 200) throw new Error("Failed to submit enquiry");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  }

  return (
    <>
      <Lander
        title_data={page.lander.title.map((t, i) => ({
          title: t,
          title2: page.lander.title2?.[i] ?? undefined,
          des: page.lander.des[i] ?? undefined,
        }))}
        button={page.lander.button?.enable || false}
        buttonTxt={page.lander.button?.text || ""}
        buttonLink={page.lander.button?.link || ""}
        currency={true}
        flip={page.lander.flip || false}
        images={
          page.lander.image && page.lander.image.length > 0
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
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 items-center justify-center text-center">
          <h1 className="md:text-4xl text-2xl font-bold text-navy">
            {page.fullscreen?.title}
          </h1>
          <div
            className="md:text-lg text-sm font-medium leading-relaxed md:w-full w-[90%] text-center m-auto [&_p]:m-0 [&_p:empty]:h-[1em]"
            dangerouslySetInnerHTML={{ __html: page.fullscreen?.des || "" }}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative w-[90%] md:w-1/2 bg-mix2/10 border-mix border-2 p-10 rounded-4xl mx-auto flex flex-col gap-8 items-center justify-center text-center my-20"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/70 rounded-4xl flex flex-col items-center justify-center z-10 gap-3">
              <svg
                className="animate-spin h-10 w-10 text-navy"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-navy font-semibold text-sm">Submitting your enquiry…</p>
            </div>
          )}
          <div className="w-full flex flex-col gap-4">
            <p className="md:text-4xl text-2xl font-bold text-navy text-left">
              Send Us an Enquiry
            </p>
            <div className="flex flex-row gap-4">
              <input
                type="text"
                placeholder="First Name"
                name="firstname"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastname"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <input
              type="text"
              placeholder="Organization"
              name="organization"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Location"
              name="location"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="w-full flex flex-col gap-2 text-left">
              <p>How can you assist?</p>
              <select
                name="assistance"
                id="assistance"
                required
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
              placeholder="How can we assist you?"
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>

            {status === "success" && (
              <p className="text-green-600 font-medium">
                Your enquiry has been submitted successfully!
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600 font-medium">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-navy text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

        <div className="mt-16 w-full flex flex-col  mx-auto">
          <h2 className="md:text-4xl text-2xl font-bold text-navy mb-10 text-center">
            Our Offices
          </h2>

          <div className="flex md:flex-row flex-col md:gap-10 gap-5 justify-center  mx-auto">
            {/* London Office */}
            {page.locations?.map((location, index) => (
              <div className="mb-10" key={index}>
                <iframe
                  src={location.src}
                  width="200"
                  height="200"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-4xl"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <h3 className="text-lg font-bold my-2">{location.title}</h3>
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
                      href={`tel:${location.phone}`}
                      className="text-[15px] text-blue-500 hover:underline"
                    >
                      {location.phone}
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
                      href={`mailto:${location.email}`}
                      className="text-[15px] text-blue-500 hover:underline"
                    >
                      {location.email}
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
                <div
                  className="text-[15px] mb-1 leading-tight [&_p]:m-0 [&_p:empty]:h-[1em]"
                  dangerouslySetInnerHTML={{ __html: location.address || "" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
