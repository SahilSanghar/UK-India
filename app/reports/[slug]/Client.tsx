"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { normalizeRichTextHtml } from "../../../lib/normalizeRichTextHtml";
import axios, { AxiosError } from "axios";

interface PostProps {
  id: string;
  image: string;
  title: string;
  date: string;
  content: string;
  download: boolean;
}

interface SessionProps {
  type: string;
  firstname: string;
  lastname: string;
  organization: string;
  id: string;
}
export default function Client({
  post,
  session,
}: {
  post: PostProps;
  session: SessionProps;
}) {
  const [signup, setSignup] = useState(true);
  const [login, setLogin] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    organization: "",
    phone: "",
    email: "",
    password: "",
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{
    message: string;
    type: "success" | "error" | "";
    loading: boolean;
  }>({
    message: "",
    type: "",
    loading: false,
  });

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/enquiry/signup`, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        organization: formData.organization,
        phone: formData.phone,
        message: formData.message,
      });
      if (response.status !== 200) {
        setMessage({
          message: response.data.message || "Unknown Error!",
          type: "error",
          loading: false,
        });
      }
      setMessage({
        message: response.data.message || "Sign up successful!",
        type: "success",
        loading: false,
      });
      window.location.reload();
      return;
    } catch (error) {
      setMessage({
        message:
          (error as AxiosError<{ message: string }>)?.response?.data?.message ||
          (error as AxiosError<{ message: string }>)?.message ||
          "An error occurred. Please try again.",
        type: "error",
        loading: false,
      });
      return;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.get(
        `/api/enquiry/login?username=${formData.email}&password=${formData.password}`,
      );
      if (response.status !== 200) {
        setMessage({
          message: response.data.message || "Unknown Error!",
          type: "error",
          loading: false,
        });
        return;
      }
      setMessage({
        message: response.data.message || "Login successful!",
        type: "success",
        loading: false,
      });
      window.location.reload();
      return;
    } catch (error: unknown) {
      setMessage({
        message:
          (error as AxiosError<{ message: string }>)?.response?.data?.message ||
          (error as AxiosError<{ message: string }>)?.message ||
          "An error occurred. Please try again.",
        type: "error",
        loading: false,
      });
      return;
    }
  };

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
          src={`https://d2paj8ptqa22jg.cloudfront.net/reports/${post.id}.webp`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== "/default.png") {
              target.src = "/default.png";
            }
          }}
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
          // <div className="mt-10">
          //   <a href={`https://d2paj8ptqa22jg.cloudfront.net/reports/pdfs/${post.id}.pdf`} target="_blank" rel="noopener noreferrer" className="text-white hover:bg-navy/80 transition-colors duration-300   gap-2 bg-navy px-4 py-3 rounded-lg">
          //     Download Report
          //   </a>
          // </div>
          <div
            className="mt-10"
            onClick={async () => {
              if (session) {
                try {
                  const response = await axios.post(`/api/enquiry/report`, {
                    reportId: post.id,
                    userId: session.id,
                    organization: session.organization,
                    reportName: post.title,
                  });
                  if (response.status !== 200) {
                    return;
                  }
                } catch (error) {}
                window.location.href = `https://d2paj8ptqa22jg.cloudfront.net/reports/pdfs/${post.id}.pdf`;
              } else {
                setLogin(true);
              }
            }}
          >
            <button className="text-white hover:bg-navy/80 transition-colors duration-300   gap-2 bg-navy px-4 py-3 rounded-lg">
              Download Report
            </button>
          </div>
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
            initial={{ opacity: 0, scale: 0.95 }}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
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
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => handleSignup(e)}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="firstName"
                      autoComplete="given-name"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                      required
                    />
                    <input
                      type="text"
                      placeholder="Surname"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="surname"
                      autoComplete="family-name"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({ ...formData, lastname: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Organization"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="organization"
                      autoComplete="organization"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full sm:w-1/2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      name="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      tabIndex={-1}
                      onClick={() =>
                        setShowPassword?.((prev: boolean) => !prev)
                      }
                    >
                      {showPassword ? (
                        // eye-off SVG
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.586-9-8 0-1.53.497-3.027 1.409-4.34m3.604 2.07A3 3 0 1112 15a3 3 0 01-3-3c0-.54.135-1.05.37-1.49m11.063-2.255C20.29 7.95 21 9.454 21 11c0 4.414-4 8-9 8a10.05 10.05 0 01-2.84-.395M17.657 16.657l-9.9-9.9"
                          />
                        </svg>
                      ) : (
                        // eye SVG
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4.418-4 8-9 8s-9-3.582-9-8 4-8 9-8 9 3.582 9 8z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <textarea
                    placeholder="How can we help you?"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors resize-none"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-navy hover:bg-navy/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors mt-1 cursor-pointer"
                    disabled={message.loading}
                  >
                    {message.loading ? "Loading..." : "Sign up"}
                  </button>
                  {message.message && (
                    <div
                      className={`${message.type === "success" ? "text-green-500" : "text-red-500"} font-medium`}
                    >
                      {message.message}
                    </div>
                  )}
                </form>
              ) : (
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => handleLogin(e)}
                >
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      tabIndex={-1}
                      onClick={() =>
                        setShowPassword?.((prev: boolean) => !prev)
                      }
                    >
                      {showPassword ? (
                        // eye-off SVG
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.586-9-8 0-1.53.497-3.027 1.409-4.34m3.604 2.07A3 3 0 1112 15a3 3 0 01-3-3c0-.54.135-1.05.37-1.49m11.063-2.255C20.29 7.95 21 9.454 21 11c0 4.414-4 8-9 8a10.05 10.05 0 01-2.84-.395M17.657 16.657l-9.9-9.9"
                          />
                        </svg>
                      ) : (
                        // eye SVG
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 4.418-4 8-9 8s-9-3.582-9-8 4-8 9-8 9 3.582 9 8z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-navy hover:bg-navy/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors mt-1 cursor-pointer"
                    disabled={message.loading}
                  >
                    {message.loading ? "Loading..." : "Log in"}
                  </button>
                  {message.message && (
                    <div
                      className={`${message.type === "success" ? "text-green-500" : "text-red-500"} font-medium`}
                    >
                      {message.message}
                    </div>
                  )}
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
