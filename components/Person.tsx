import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  name: string;
  image: string;
  role?: string;
  location?: string;
  blurdata?: string | "";
  theme?: "dark" | "light";
  position?: string;
  des1?: string;
  des2?: string;
  link?: string;
  role2?: string;
}

export default function Person({
  name,
  image,
  role,
  role2,
  location,
  blurdata,
  theme,
  position,
  des1,
  des2,
  link,
}: Props) {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
        className={`w-full h-fit flex flex-col justify-center items-center ${
          theme == "dark" ? "text-black" : "text-white"
        }`}
      >
        <div
          className="md:w-32 md:h-32 w-28 h-28 rounded-full bg-black flex cursor-pointer hover:opacity-50 duration-300 select-none "
          onClick={() => setClicked(true)}
        >
          <Image
            src={image}
            width={0}
            height={0}
            {...(blurdata
              ? { blurDataURL: blurdata, placeholder: "blur" }
              : {})}
            alt={""}
            sizes="100% 100%"
            className="w-full h-full rounded-full object-cover select-none"
          ></Image>
        </div>
        <p className="md:text-xl md:h-fit min-h-[30px] h-fit text-lg font-bold text-center leading-5 mt-2">
          {name}
        </p>
        <p className="md:text-base text-sm font-medium opacity-80 text-center leading-5 xl:mt-0 mt-2">
          {role2 ? (
            <>
              {role} <br /> {role2}
            </>
          ) : (
            role
          )}
        </p>
        {location !== "Location" && (
          <p className="md:text-base text-sm leading-4 h-fit font-medium opacity-80 text-center">
            {location}
          </p>
        )}
      </motion.div>

      <AnimatePresence>
        {clicked && (
          <>
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 w-screen h-screen bg-black/50 z-20 backdrop-blur-sm"
              aria-label="Close person modal"
              onClick={() => setClicked(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 p-5 rounded-4xl bg-black/90 backdrop-blur-sm text-white flex flex-col shadow-2xl overflow-y-auto w-[80%] md:w-[700px] max-h-[80vh] h-fit`}
              role="dialog"
              aria-modal="true"
            >
              {/* Sticky Close Button Wrapper */}
              <div className="sticky top-0 left-0 right-0 flex justify-end pointer-events-none z-30">
                {/* Close Button - Top Right for MD+ screens */}
                <button
                  title="Close"
                  type="button"
                  aria-label="Close Person Modal"
                  className="hidden md:block absolute md:static right-5 top-5 md:right-0 md:top-0 size-10 z-30 cursor-pointer hover:scale-105 duration-100 bg-transparent pointer-events-auto"
                  onClick={() => setClicked(false)}
                  style={{ pointerEvents: "auto" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="size-10"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Close Button - Small screens */}
                <button
                  title="Close"
                  type="button"
                  aria-label="Close Person Modal"
                  className="md:hidden absolute md:static right-0 mr-4 mt-1 md:mr-0 md:mt-0 size-10 cursor-pointer hover:scale-105 duration-100 z-30 bg-transparent pointer-events-auto"
                  onClick={() => setClicked(false)}
                  style={{ pointerEvents: "auto" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="size-10"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {/* Modal Description */}
              <div className="relative w-full flex flex-col items-center justify-center md:py-12 py-6">
                {des1 && (
                  <p
                    className="text-center text-base md:text-lg font-medium px-4"
                    dangerouslySetInnerHTML={{ __html: des1 }}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
