"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { normalizeRichTextHtml } from "../../../lib/normalizeRichTextHtml";

interface PostProps {
  yoast_head_json: {
    og_image: { url: string }[];
  };
  title: { rendered: string };
  date: string;
  content: { rendered: string };
}
export default function Client({ post }: { post: PostProps }) {
  return (
    <motion.div className="w-full mx-auto  py-10 mt-11">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="w-[80%] mx-auto h-[500px] relative flex flex-col gap-4"
      >
        <Image
          src={post?.yoast_head_json?.og_image?.[0]?.url ?? ""}
          alt={post?.title?.rendered ?? "Untitled"}
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
        className="w-full max-w-7xl mx-auto px-4 py-10 mt-10"
      >
        <h1 className="text-4xl font-bold text-navy" dangerouslySetInnerHTML={{ __html: post?.title?.rendered ?? "Untitled" }} />
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
            __html: normalizeRichTextHtml(post?.content?.rendered ?? ""),
          }}
        />
      </motion.div>
    </motion.div>
  );
}
