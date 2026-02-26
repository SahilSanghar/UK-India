"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { normalizeRichTextHtml } from "../../../lib/normalizeRichTextHtml";

interface PostProps {
  id: string;
  image: string;
  title: string;
  date: string;
  content: string;
  download: boolean;
}
export default function Client({ post }: { post: PostProps }) {
  const [signup, setSignup] = useState(true);
  const [login, setLogin] = useState(false);
  return (
    <motion.div className="w-full mx-auto  py-10 mt-11">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="w-[80%] md:w-[50%] mx-auto aspect-video relative flex flex-col gap-4 "
      >
        <Image
          src={post?.image ?? ""}
          alt={post?.title ?? "Untitled"}
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="w-full h-full object-cover border-4 border-mix rounded-4xl"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-7xl mx-auto px-4 py-10 mt-10"
      >
        <h1
          className="text-4xl font-bold text-navy"
          dangerouslySetInnerHTML={{
            __html: post?.title ?? "Untitled",
          }}
        />
        <p className="text-md font-medium text-gray-500">
          {post?.date
            ? (() => {
                // Formatter for: October 24, 2024
                const dateObj = new Date(post.date);
                if (isNaN(dateObj.getTime())) return "";
                const month = dateObj.toLocaleString("default", {
                  month: "long",
                });
                const day = dateObj.getDate();
                const year = dateObj.getFullYear();
                return `${month} ${day}, ${year}`;
              })()
            : ""}
        </p>
        <div
          className="mt-10 prose prose-p:mb-4 prose-p:last:mb-0 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: normalizeRichTextHtml(post?.content ?? ""),
          }}
        />
        {post?.download && (
          <div className="mt-10">
            <a href={`https://d2paj8ptqa22jg.cloudfront.net/reports/pdfs/${post.id}.pdf`} target="_blank" rel="noopener noreferrer" className="text-white hover:bg-navy/80 transition-colors duration-300   gap-2 bg-navy px-4 py-3 rounded-lg">
              Download Report
            </a>
          </div>
          // <div className="mt-10" onClick={() => setLogin(true)}>
          //   <button className="text-white hover:bg-navy/80 transition-colors duration-300   gap-2 bg-navy px-4 py-3 rounded-lg">
          //     Download Report
          //   </button>
          // </div>
        )}
      </motion.div>
      {login && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLogin(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95}}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-navy px-6 py-5 sm:px-8 sm:py-6">
              <button
                onClick={() => setLogin(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {signup ? "Sign up to download" : "Log in to download"}
              </h2>
              <p className="text-sm text-white/70 mt-1 line-clamp-1">
                {post?.title}
              </p>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              {signup ? (
                <form className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="firstName"
                      autoComplete="given-name"
                    />
                    <input
                      type="text"
                      placeholder="Surname"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="surname"
                      autoComplete="family-name"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Organization"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="organization"
                      autoComplete="organization"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="phone"
                      autoComplete="tel"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                    name="email"
                    autoComplete="email"
                  />
                  <textarea
                    placeholder="Message (optional)"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors resize-none"
                    name="message"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="w-full bg-navy hover:bg-navy/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors mt-1 cursor-pointer"
                  >
                    Sign up
                  </button>
                </form>
              ) : (
                <form className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full bg-navy hover:bg-navy/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors mt-1 cursor-pointer"
                  >
                    Log in
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-gray-500 mt-5">
                {signup ? "Already have an account?" : "Don't have an account?"}{" "}
                <span
                  className="text-navy font-semibold cursor-pointer hover:underline"
                  onClick={() => setSignup(!signup)}
                >
                  {signup ? "Log in" : "Sign up"}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
