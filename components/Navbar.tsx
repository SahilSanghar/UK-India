"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
// import { useNavbar } from "@/lib/navbar-context";

interface Sublink {
  label: string;
  href?: string | null;
}

interface NavLink {
  label: string;
  href?: string | null;
  sublinks?: Sublink[];
}

export default function Navbar() {
  const pathname = usePathname();
  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const change = false;

  const links: NavLink[] = [
    {
      label: "What We Do",
      href: "",
      sublinks: [
        {
          label: "Interaction",
          href: "/interaction",
        },
        {
          label: "Intelligence",
          href: "/intelligence",
        },
        {
          label: "Influence",
          href: "/influence",
        },
      ],
    },
    {
      label: "Who We Are",
      href: "#",
      sublinks: [
        {
          label: "About Us",
          href: "/about",
        },
        {
          label: "Meet the Team",
          href: "/team",
        },
        {
          label: "Group Board",
          href: "/group-board",
        },
        {
          label: "Our Members",
          href: "/members",
        },
      ],
    },
    {
      label: "Our Resources",
      href: "#",
      sublinks: [
        {
          label: "Reports",
          href: "/reports",
        },
        {
          label: "Projects",
          href: "/projects",
        },
        {
          label: "Events",
          href: "/events",
        },
        {
          label: "News",
          href: "/news",
        },
      ],
    },
    {
      label: "What we offer",
      href: "#",
      sublinks: [
        {
          label: "Launchpad",
          href: "/launchpad",
        },
        {
          label: "Vacancies",
          href: "/vacancies",
        },
        {
          label: "Group Board",
          href: "/group-board",
        },
        {
          label: "TNE",
          href: "/tne",
        },
        {
          label: "Government Relations",
          href: "/government-relations",
        },
        {
          label: "Higher Education Advisory",
          href: "/higher-education-advisory",
        },
      ],
    },
    {
      label: "Contact Us",
      href: "/contact",
    },
  ];

  const [time, setTime] = useState<{ ist: string; gmt: string }>({
    ist: "00:00",
    gmt: "00:00",
  });

  useEffect(() => {
    const updateTime = () => {
      const ist = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
      const gmt = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/London",
      });
      setTime({ ist: ist.toString(), gmt: gmt.toString() });
    };

    // Update immediately on mount
    updateTime();

    // Then update every second
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  const handleMouseEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const [scroll, setScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    !isAdminDashboard && (
      <nav
        className={`flex w-full h-fit transition-all duration-300 ease-in-out text-black items-center px-6 md:px-10 fixed top-0 z-50 ${
          scroll ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div
          className={`relative mr-auto duration-300 ease-in-out h-auto ${
            !scroll ? "w-[120px] md:w-[200px]" : "w-[100px] md:w-[180px]"
          }`}
        >
          {/* White shadow background */}
          {/* <div
          className="absolute inset-2 rounded-full bg-white/90 shadow-lg z-0 "
          style={{
            filter:
              "drop-shadow(0 4px 18px rgba(0,0,0,0.11)) drop-shadow(0 1.5px 12px rgba(0,0,0,0.07))",
          }}
        ></div> */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                // Navigation will reset scroll position, but ensure it scrolls to top
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }
            }}
            className="w-full h-full relative z-10 flex items-center "
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={0}
              sizes="100vw"
              height={0}
              className={`w-full h-full object-contain cursor-pointer transition-all duration-300 ease-in-out ${
                change ? "invert brightness-0" : "invert-0 brightness-100"
              }`}
              priority
            />
          </Link>
        </div>

        <motion.ul
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`hidden lg:flex items-center justify-center transition-all duration-300 ease-in-out gap-1 md:gap-6 text-xs md:text-sm  xl:text-base font-medium h-12 px-10  rounded-full 2xl:absolute 2xl:left-1/2 2xl:-translate-x-1/2  2xl:w-fit
          ${
            scroll
              ? "bg-transparent border-none text-black"
              : " border-mix border bg-black/50 backdrop-blur-sm text-white"
          }
          `}
        >
          {links.map((link) => (
            <li
              key={link.label}
              className="relative group flex flex-row  h-full  "
              onMouseEnter={() => link.sublinks && handleMouseEnter(link.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={link.href || "#"}
                className=" flex flex-row justify-center items-center gap-2"
              >
                {link.label}
                {link.sublinks && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-3 font-bold stroke-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                )}
              </Link>
              {link.sublinks && openDropdown === link.label && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 text-white transform -translate-x-1/2 top-12 mt-0 bg-black/50 backdrop-blur-xl shadow-lg rounded-md  min-w-[180px] py-2 border border-mix z-10 "
                >
                  {link.sublinks.map((sublink) => (
                    <li key={sublink.label}>
                      <Link
                        href={sublink.href || "#"}
                        className="block px-4 py-2 first:border-none border-t-2 transition-colors duration-200 ease-in-out text-sm"
                      >
                        {sublink.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
        </motion.ul>

        <ul
          className={`hidden 2xl:flex items-center justify-center transition-all duration-300 ease-in-out gap-6 md:gap-5 text-sm md:text-  xl:text-base font-medium h-12 px-5  rounded-full border border-mix ml-3  ${
            scroll
              ? "bg-transparent border-none text-black"
              : " border-mix border bg-black/50 backdrop-blur-sm text-white"
          }`}
        >
          <li className="ml-auto flex items-center gap-2 ">
            <span>GMT:</span>
            <span>{time.gmt}</span>
          </li>
          <li className="flex items-center gap-2 ">
            <span>IST:</span>
            <span>{time.ist}</span>
          </li>
        </ul>

        <div
          className="lg:hidden flex items-center justify-center  cursor-pointer"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6  md:size-8 stroke-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 md:size-8 stroke-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </div>

        <AnimatePresence>
          {mobileMenu && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-10 pt-10 md:pt-0 md:top-20 h-screen left-0 w-full bg-white shadow-lg  py-2 border border-gray-100 z-10 justify-center items-center"
            >
              {links.map((link) => {
                const expanded = openDropdown === link.label;
                return (
                  <li key={link.label} className="w-full cursor-pointer ">
                    {link.sublinks ? (
                      <button
                        className="w-full text-left py-2 px-10 hover:bg-gray-50 transition-colors duration-200 text-md flex flex-row justify-between items-center gap-2 font-medium cursor-pointer"
                        onClick={() =>
                          setOpenDropdown(expanded ? null : link.label)
                        }
                        aria-expanded={expanded}
                      >
                        <span>{link.label}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={`size-3 font-bold stroke-4 transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={link.href || "#"}
                        className="w-full text-left px-10 py-2 hover:bg-gray-50 transition-colors duration-200 text-md flex flex-row justify-between items-center gap-2 font-medium cursor-pointer"
                        onClick={() => setMobileMenu(false)}
                      >
                        <span>{link.label}</span>
                      </Link>
                    )}
                    {link.sublinks && expanded && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full bg-gray-50 border-t border-gray-100"
                      >
                        {link.sublinks.map((sublink) => (
                          <li key={sublink.label}>
                            <Link
                              className="block px-15 py-2 hover:bg-gray-100 transition-colors duration-200 text-sm"
                              href={sublink.href || "#"}
                              onClick={() => setMobileMenu(false)}
                            >
                              {sublink.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    )
  );
}
