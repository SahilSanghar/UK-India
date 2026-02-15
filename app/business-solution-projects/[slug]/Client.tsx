"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { normalizeRichTextHtml } from "../../../lib/normalizeRichTextHtml";

interface PostProps {
  image: string;
  title: string;
  date: string;
  content: string;
}
export default function Client({ post }: { post: PostProps }) {
  return (
    <motion.div className="w-full mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="min-w-[500px] w-[90%] md:w-[50%] mx-auto aspect-video relative flex flex-col gap-4 mt-20"
      >
        <Image
          src={post?.image ?? ""}
          alt={post?.title ?? "Untitled"}
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="w-full h-full object-cover rounded-4xl"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-7xl mx-auto px-4 py-10 "
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
                // Formatter for: e.g. 26th August 2020
                const dateObj = new Date(post.date);
                if (isNaN(dateObj.getTime())) return "";
                const day = dateObj.getDate();
                const ordinal =
                  day % 10 === 1 && day !== 11
                    ? "st"
                    : day % 10 === 2 && day !== 12
                      ? "nd"
                      : day % 10 === 3 && day !== 13
                        ? "rd"
                        : "th";
                const month = dateObj.toLocaleString("default", {
                  month: "long",
                });
                const year = dateObj.getFullYear();
                return `${day}${ordinal} ${month} ${year}`;
              })()
            : ""}
        </p>
        <div
          className="mt-10 prose prose-p:mb-4 prose-p:last:mb-0 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: normalizeRichTextHtml(post?.content ?? ""),
          }}
        />
      </motion.div>
    </motion.div>
  );
}
