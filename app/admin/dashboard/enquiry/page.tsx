"use client";

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface EnquiryItem {
  id: string;
  type: string;
  userId?: string;
  reportId?: string;
  reportName?: string;
  organization?: string;
  date: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  location?: string;
  assistance?: string;
  message?: string;
}

interface UserDetails {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  organization?: string;
  phone?: string;
  message?: string;
  date?: string;
}

interface ReportDetails {
  id: string;
  title?: string;
  slug?: string;
  date?: string;
}

export default function Page() {
  const [filterType, setFilterType] = useState<"contact" | "report">("contact");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [details, setDetails] = useState<{
    user: UserDetails | null;
    report: ReportDetails | null;
  } | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["enquiry", filterType],
      queryFn: ({ pageParam }) =>
        axios
          .get("/api/admin/enquiry", {
            params: {
              type: filterType,
              limit: 10,
              lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
            },
            headers: {
              "Cache-Control": "no-store",
            },
          })
          .then((res) => res.data),
      getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
      initialPageParam: undefined,
      gcTime: 0,
      staleTime: 0,
    });

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);

  useEffect(() => {
    const items =
      data?.pages
        .flatMap((page) => (page?.enquiries as EnquiryItem[]) ?? [])
        ?.filter(Boolean) ?? [];
    setEnquiries(items);
  }, [data]);

  useEffect(() => {
    setExpandedId(null);
    setDetails(null);
  }, [filterType]);

  const handleCardClick = async (item: EnquiryItem) => {
    if (expandedId === item.id) {
      setExpandedId(null);
      setDetails(null);
      return;
    }

    setExpandedId(item.id);
    setDetails(null);

    if (item.type === "contact") {
      return;
    }

    setDetailsLoading(true);
    try {
      const res = await axios.get("/api/admin/enquiry/details", {
        params: {
          userId: item.userId || undefined,
          reportId: item.reportId || undefined,
        },
      });
      setDetails(res.data);
    } catch {
      setDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col pb-10 pt-25 px-10 z-20">
      <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
        Enquiries
      </h1>
      <p className="text-sm text-center flex items-center justify-center mb-5 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white">
        Total: {data?.pages[0]?.count ?? 0}
      </p>

      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setFilterType("contact")}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-150 cursor-pointer ${
            filterType === "contact"
              ? "bg-navy text-white"
              : "bg-white border border-navy text-navy hover:bg-navy/5"
          }`}
        >
          Contact
        </button>
        <button
          onClick={() => setFilterType("report")}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-150 cursor-pointer ${
            filterType === "report"
              ? "bg-navy text-white"
              : "bg-white border border-navy text-navy hover:bg-navy/5"
          }`}
        >
          Reports
        </button>
      </div>

      <div className="w-full h-fit flex-col gap-5 flex justify-center items-center">
        {isLoading ? (
          <p>Loading...</p>
        ) : enquiries.length === 0 ? (
          <p className="text-gray-500 mt-10">No enquiries found.</p>
        ) : (
          enquiries.map((item) => (
            <div key={item.id} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                onClick={() => void handleCardClick(item)}
                className={`w-full h-fit flex items-center justify-between rounded-lg px-6 py-4 cursor-pointer transition-all duration-150 ${
                  expandedId === item.id
                    ? "bg-navy/10"
                    : "bg-black/5 hover:bg-black/10"
                }`}
              >
                {filterType === "report" ? (
                  <p className="text-base text-navy">
                    <span className="font-bold">
                      {item.organization || "Unknown"}
                    </span>{" "}
                    downloaded{" "}
                    <span className="font-bold">
                      {item.reportName || "Untitled Report"}
                    </span>
                  </p>
                ) : (
                  <p className="text-base text-navy">
                    <span className="font-bold">
                      {item.organization || "Unknown"}
                    </span>{" "}
                    filled the contact form
                  </p>
                )}
                <p className="text-sm text-gray-500 shrink-0 ml-4">
                  {(() => {
                    const d = new Date(item.date);
                    const month = d.toLocaleString("en-US", {
                      month: "long",
                    });
                    return `${month} ${d.getDate()}, ${d.getFullYear()}`;
                  })()}
                </p>
              </motion.div>

              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white border border-navy/10 rounded-b-lg p-6 flex flex-col gap-4 shadow-sm">
                      {item.type === "contact" ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-lg font-bold text-navy">
                            Contact Details
                          </p>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <p>
                              <span className="font-semibold text-navy">
                                Name:
                              </span>{" "}
                              {item.firstname} {item.lastname}
                            </p>
                            {item.email && (
                              <p>
                                <span className="font-semibold text-navy">
                                  Email:
                                </span>{" "}
                                {item.email}
                              </p>
                            )}
                            {item.organization && (
                              <p>
                                <span className="font-semibold text-navy">
                                  Organization:
                                </span>{" "}
                                {item.organization}
                              </p>
                            )}
                            {item.location && (
                              <p>
                                <span className="font-semibold text-navy">
                                  Location:
                                </span>{" "}
                                {item.location}
                              </p>
                            )}
                            {item.assistance && item.assistance !== "none" && (
                              <p>
                                <span className="font-semibold text-navy">
                                  Assistance:
                                </span>{" "}
                                {item.assistance}
                              </p>
                            )}
                            {item.message && (
                              <p className="col-span-2">
                                <span className="font-semibold text-navy">
                                  Message:
                                </span>{" "}
                                {item.message}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : detailsLoading ? (
                        <p className="text-gray-500">Loading details...</p>
                      ) : details ? (
                        <>
                          {details.user && (
                            <div className="flex flex-col gap-2">
                              <p className="text-lg font-bold text-navy">
                                User Details
                              </p>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                {details.user.firstname && (
                                  <p>
                                    <span className="font-semibold text-navy">
                                      Name:
                                    </span>{" "}
                                    {details.user.firstname}{" "}
                                    {details.user.lastname}
                                  </p>
                                )}
                                {details.user.email && (
                                  <p>
                                    <span className="font-semibold text-navy">
                                      Email:
                                    </span>{" "}
                                    {details.user.email}
                                  </p>
                                )}
                                {details.user.organization && (
                                  <p>
                                    <span className="font-semibold text-navy">
                                      Organization:
                                    </span>{" "}
                                    {details.user.organization}
                                  </p>
                                )}
                                {details.user.phone && (
                                  <p>
                                    <span className="font-semibold text-navy">
                                      Phone:
                                    </span>{" "}
                                    {details.user.phone}
                                  </p>
                                )}
                                {details.user.message && (
                                  <p className="col-span-2">
                                    <span className="font-semibold text-navy">
                                      Message:
                                    </span>{" "}
                                    {details.user.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {details.report && (
                            <div className="flex flex-col gap-2 border-t border-navy/10 pt-4">
                              <p className="text-lg font-bold text-navy">
                                Report
                              </p>
                              <p className="text-sm">
                                <span className="font-semibold text-navy">
                                  Title:
                                </span>{" "}
                                {details.report.title || "Untitled"}
                              </p>
                              {details.report.slug && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      `/reports/${details.report!.slug}`,
                                      "_blank",
                                    );
                                  }}
                                  className="bg-navy w-fit text-white px-4 py-2 rounded-full shadow hover:bg-navy/90 transition-all duration-150 cursor-pointer mt-1"
                                >
                                  Visit Report
                                </button>
                              )}
                            </div>
                          )}

                          {!details.user && !details.report && (
                            <p className="text-gray-500">
                              No additional details available.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">
                          Failed to load details.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto mt-10 px-6 py-2 bg-navy text-white rounded-full cursor-pointer"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}
