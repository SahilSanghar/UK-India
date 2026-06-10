"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { normalizeRichTextHtml } from "../../../lib/normalizeRichTextHtml";

interface PostProps {
  image: string;
  title: string;
  date: string;
  content: string;
  download?: boolean;
  pdfUrl?: string;
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
          src={post?.image ?? "/default.png"}
          alt={post?.title ?? "Untitled"}
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="w-full h-full object-cover rounded-4xl"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src !== "/default.png") {
              img.src = "/default.png";
            }
          }}
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
          dangerouslySetInnerHTML={{ __html: post?.title ?? "Untitled" }}
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
        {post?.pdfUrl && (
          <a
            href={post.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-6 inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-5 py-3 rounded-full shadow transition-colors duration-150 w-fit"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        )}
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
