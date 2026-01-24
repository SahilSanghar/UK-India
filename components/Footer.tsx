"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    companyName: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", formData);
    // Reset form
    setFormData({
      firstName: "",
      surname: "",
      companyName: "",
      email: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const usefulLinks = [
    "Influence",
    "Interaction",
    "Intelligence",
    "About",
    "Membership",
    "Reports",
    "Events",
    "Projects",
    "Launchpad",
    "Vacancies",
    "Group Board",
    "TNE",
    "Government Relations",
    "Higher Education Advisory",
  ];

  return (
    !isAdminDashboard && (
      <footer className="w-full bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Column 1: Branding and Social Media */}
            <div className="flex flex-col gap-6 lg:border-r-2 border-white/20 pr-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">UK INDIA</h2>
                <p className="text-sm md:text-base">BUSINESS COUNCIL</p>
              </div>
              <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <span className="text-sm md:text-base">
                  +44 (0)20 7592 3040
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <span className="text-sm md:text-base">
                  enquiries@ukibc.com
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/uk-india-business-council/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy/80 hover:bg-navy/60 border border-white/20 rounded flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://x.com/UKIBC"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy/80 hover:bg-navy/60 border border-white/20 rounded flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@ukindiabusinesscouncil8888"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy/80 hover:bg-navy/60 border border-white/20 rounded flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/ukindia_bc/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy/80 hover:bg-navy/60 border border-white/20 rounded flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="flex flex-col gap-4 lg:border-r-2 border-white/20 pr-10">
            <h3 className="text-base md:text-lg font-bold uppercase">
              Useful Links
            </h3>
            <ul className="flex flex-col gap-2">
              {usefulLinks.map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-2 text-sm md:text-base hover:text-white/80 transition-colors"
                  >
                    <span className="text-white">{" >"}</span>
                    <span>{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Get In Touch */}
          <div className="flex flex-col gap-6 lg:border-r-2 border-white/20 pr-10 ">
            <h3 className="text-base md:text-lg font-bold uppercase">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-6">
              {/* London */}
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-sm md:text-base">LONDON</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                    <span className="text-sm md:text-base">
                      +44 (0)20 7592 3040
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                    <span className="text-sm md:text-base">
                      enquiries@ukibc.com
                    </span>
                  </div>
                </div>
              </div>

              {/* Delhi */}
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-sm md:text-base">DELHI</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                    <span className="text-sm md:text-base">
                      +91(0) 124 502 6059
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                    <span className="text-sm md:text-base">
                      enquiries@ukibc.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4 ">
            <h3 className="text-base md:text-lg font-bold uppercase">
              Newsletter
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
              <div className="flex gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name..."
                  value={formData.firstName}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 w-full bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:border-white/40 text-sm md:text-base"
                  required
                />
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname..."
                  value={formData.surname}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 w-full bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:border-white/40 text-sm md:text-base"
                  required
                />
              </div>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name..."
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:border-white/40 text-sm md:text-base"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address..."
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:border-white/40 text-sm md:text-base"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg text-white font-semibold transition-colors text-sm md:text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/80">
          <p>© 2024 UK India Business Council. All Rights Reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link
              href="/disclaimer"
              className="hover:text-white transition-colors"
            >
              Disclaimer
            </Link>
            <span>|</span>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy & Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
    )
  );
}
