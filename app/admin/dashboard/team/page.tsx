"use client";

import React, { useEffect, useState, useRef } from "react";

import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import TextEditor from "@/components/TextEditor";

interface PostProps {
  id: number;
  title: string;
  image: string;
  content: string;
  slug: string;
  job_title: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  date: string;
  sort: string;
}

export default function Page() {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["team"],
      queryFn: ({ pageParam }) =>
        axios
          .get("/api/admin/team", {
            params: {
              limit: 0,
              lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
            },
            // Disable cache by setting Cache-Control header and add a timestamp param
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

  const [sortedTeam, setSortedTeam] = useState<PostProps[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [edit, setEdit] = useState({
    edit: false,
    id: "",
    title: "",
    image: "",
    job_title: "",
    content: "",
    date: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFile = async (file: File | undefined | null, id: string) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    const signedUrl = await axios.post("/api/admin/team/image/signed", {
      key: `team/${id}`,
    });

    if (!signedUrl) {
      alert("Failed to get signed url");
      return;
    }

    console.log(signedUrl.data.signedUrl);

    const uploadImage = await axios.put(signedUrl.data.signedUrl, file, {
      headers: {
        "Content-Type": file?.type || "image/jpeg",
      },
    });

    if (!uploadImage) {
      alert("Failed to upload image");
      return;
    }

    alert("Image uploaded successfully");
    queryClient.invalidateQueries({ queryKey: ["team"] });
  };

  const {
    mutate: editTeam,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: {
      id: string;
      title: string;
      job_title: string;
      content: string;
      date: string;
    }) => axios.post("/api/admin/team/edit", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setEdit({ ...edit, edit: false });
    },
    onError: () => {
      console.error("Failed to edit team member");
    },
  });

  const handleEdit = () => {
    editTeam({
      id: edit.id,
      title: edit.title,
      job_title: edit.job_title,
      content: edit.content,
      date: edit.date,
    });
  };
  useEffect(() => {
    const nextTeam =
      data?.pages
        .flatMap((page) => (page?.team as PostProps[]) ?? [])
        ?.filter(Boolean) ?? [];

    // initialize list ordered by `sort` from DB
    const sortedBySort = [...nextTeam].sort((a, b) => {
      if (a.sort < b.sort) return -1;
      if (a.sort > b.sort) return 1;
      return 0;
    });

    // eslint-disable-next-line
    setSortedTeam(sortedBySort);
  }, [data]);

  const callSortUpdateApi = async (
    left: string,
    right: string,
    id: string,
    date: string
  ) => {
    try {
      await axios.post("/api/admin/team/sort", { left, right, id, date });
    } catch (error) {
      console.error("Failed to update team sort order", error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["team"] });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();

    // auto scroll page when dragging near top/bottom
    const { clientY } = event;
    const threshold = 200;
    const viewportHeight = window.innerHeight;

    if (clientY < threshold) {
      window.scrollBy({ top: -50, behavior: "smooth" });
    } else if (clientY > viewportHeight - threshold) {
      window.scrollBy({ top: 50, behavior: "smooth" });
    }

    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setSortedTeam((prev: PostProps[]) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);

      // Find the left and right sort keys **surrounding** the new index
      const leftSort = updated[index - 1]?.sort ?? null;
      const rightSort = updated[index + 1]?.sort ?? null;
      void callSortUpdateApi(
        leftSort,
        rightSort,
        updated[index].id.toString(),
        updated[index].date.toString()
      );

      return updated;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col pb-10 pt-25 px-10 z-20">
        <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
          Team Members
        </h1>
        <p className="text-sm text-center flex items-center justify-center mb-5 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white ">
          Total members: {data?.pages[0].count ?? 0}
        </p>

        <p className="text-sm text-black text-center mb-10">
          Drag and drop to reorder the team members.
          <br />
          (Editing is available now! (new members can not be added/removed yet!))
        </p>
        <div className="w-full h-fit flex-col gap-5 flex justify-center items-center">
          {isLoading ? (
            <>
              <p>Loading...</p>
            </>
          ) : (
            <>
              {sortedTeam?.map((member: PostProps, index: number) => {
                const isDragged = draggedIndex === index;
                const isDragOver = dragOverIndex === index;

                return (
                  <>
                    {!edit.edit ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        key={member.id.toString()}
                        className={`w-full bg-black/10 h-fit flex items-center rounded-lg p-4 gap-5 cursor-move transition-all duration-150 ${
                          isDragged ? "opacity-60 scale-[0.99]" : ""
                        } ${
                          isDragOver && !isDragged
                            ? "ring-2 ring-navy/60 shadow-lg"
                            : ""
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                      >
                        <Image
                          src={
                            member.image
                              ? `${member.image}${
                                  member.image.includes("?") ? "&" : "?"
                                }v=${new Date().getTime()}`
                              : "/person.jpg"
                          }
                          alt={member.title || "No title"}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="rounded-full w-24 h-24 object-cover"
                          unoptimized
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-bold text-navy">
                            {member.title}
                          </p>
                          <p className="text-sm text-black font-bold">
                            {member.job_title}
                          </p>
                          <p className="text-sm text-black">
                            {member.location}
                          </p>
                          {/* <p className="text-sm text-black">{member.content}</p> */}
                          {/* <p className="text-sm text-black">{member.email}</p>
  <p className="text-sm text-black">{member.phone}</p>
  <p className="text-sm text-black">{member.website}</p>
  <p className="text-sm text-black">{member.facebook}</p>
  <p className="text-sm text-black">{member.twitter}</p>
  <p className="text-sm text-black">{member.instagram}</p>
  <p className="text-sm text-black">{member.linkedin}</p> */}
                        </div>

                        <div
                          className="ml-auto mr-5 underline cursor-pointer"
                          onClick={() => {
                            setPreviewImage(null);
                            setEdit({
                              edit: true,
                              id: member.id.toString(),
                              title: member.title,
                              image: member.image,
                              job_title: member.job_title,
                              content: member.content,
                              date: member.date,
                            });
                          }}
                        >
                          <p className="text-black font-medium">Edit</p>
                        </div>
                      </motion.div>
                    ) : edit.id === member.id.toString() ? (
                      <div
                        className="w-full px-20 py-10 bg-white/90 flex flex-col md:flex-row justify-center items-center rounded-2xl shadow-lg p-6 gap-8 border border-navy/10 transition-all duration-150 overflow-hidden"
                        key={edit.id}
                      >
                        <div
                          className={`w-56 h-56 mb-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            isImageDragOver
                              ? "border-navy bg-navy/5"
                              : "border-navy/30 bg-white"
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsImageDragOver(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setIsImageDragOver(false);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsImageDragOver(false);
                            const file = e.dataTransfer.files?.[0];
                            void handleImageFile(file, edit.id.toString());
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Image
                            src={
                              previewImage || edit.image
                                ? `${edit.image}${
                                    edit.image.includes("?") ? "&" : "?"
                                  }v=${new Date().getTime()}`
                                : "/person.jpg"
                            }
                            alt={edit.title || "No title"}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="rounded-2xl w-52 h-52 object-cover border border-navy/20 shadow-sm"
                          />
                          <p className="mt-2 text-xs text-center text-navy/80 px-2">
                            Drag & drop or click to upload a new photo
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              void handleImageFile(file, edit.id.toString());
                              e.target.value = "";
                            }}
                          />
                        </div>

                        <div className="flex flex-col gap-4 w-full ">
                          <div className="flex flex-col">
                            <label
                              htmlFor="title"
                              className="text-sm md:text-base text-navy font-bold mb-1"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              value={edit.title}
                              onChange={(e) =>
                                setEdit({ ...edit, title: e.target.value })
                              }
                              placeholder="Full name"
                              className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all  placeholder:text-navy/40"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label
                              htmlFor="job_title"
                              className="text-sm md:text-base text-navy font-bold mb-1"
                            >
                              Job Title
                            </label>
                            <input
                              type="text"
                              value={edit.job_title}
                              onChange={(e) =>
                                setEdit({ ...edit, job_title: e.target.value })
                              }
                              placeholder="E.g. Director, Project Manager"
                              className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all placeholder:text-navy/40"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label
                              htmlFor="content"
                              className="text-sm md:text-base text-navy font-bold mb-1"
                            >
                              Bio / Content
                            </label>

                            <TextEditor
                              content={edit.content || ""}
                              onChange={(content) =>
                                setEdit({ ...edit, content })
                              }
                            />

                            {/* <textarea
                              value={edit.content}
                              onChange={(e) =>
                                setEdit({ ...edit, content: e.target.value })
                              }
                              placeholder="Write a short bio or description..."
                              className="text-base font-medium text-gray-800 border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 h-36 rounded-lg transition-all bg-navy/5 resize-none placeholder:text-navy/40"
                            /> */}
                          </div>

                          <div className="flex flex-row gap-3 mt-4 items-center">
                            <button
                              onClick={() => handleEdit()}
                              disabled={isPending}
                              className="bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-150 cursor-pointer"
                            >
                              {isPending ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEdit({ ...edit, edit: false })}
                              className="bg-white border border-navy text-navy px-6 py-2 rounded-full shadow hover:bg-navy/5 transition-colors duration-150 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                );
              })}
            </>
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
    </>
  );
}
