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
import { PlusIcon, XIcon } from "lucide-react";
import { generateKeyBetween } from "@/lib/sort";

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
      queryKey: ["news"],
      queryFn: ({ pageParam }) =>
        axios
          .get("/api/admin/posts", {
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
  // Removed drag and drop state: draggedIndex and dragOverIndex
  const [newMember, setNewMember] = useState({
    edit: false,
    title: "",
    image: false,
    job_title: "",
    content: "",
    loading: false,
  });
  const [newMemberFile, setNewMemberFile] = useState<File | null>(null);
  const [newMemberPreview, setNewMemberPreview] = useState<string | null>(null);
  const newMemberFileInputRef = useRef<HTMLInputElement | null>(null);

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
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleNewMemberImageFile = (file: File | undefined | null) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setNewMemberPreview(objectUrl);
    setNewMemberFile(file);
    setNewMember((prev) => ({ ...prev, image: true }));
  };

  const handleImageFile = async (file: File | undefined | null, id: string) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    const signedUrl = await axios.post("/api/admin/team/image/signed", {
      key: `group-board/${id}`,
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
    queryClient.invalidateQueries({ queryKey: ["group-board"] });
  };

  const handleCreate = async () => {
    setNewMember({ ...newMember, loading: true });
    try {
      const response = await axios.post("/api/admin/group_board/create", {
        title: newMember.title,
        image: Boolean(newMemberFile),
        job_title: newMember.job_title,
        content: newMember.content,
        date: new Date().toISOString(),
        sort: generateKeyBetween(
          sortedTeam[sortedTeam.length - 1]?.sort ?? null,
          null
        ),
      });

      if (response.status === 200) {
        if (response.data.signedUrl && newMemberFile) {
          await axios.put(response.data.signedUrl, newMemberFile, {
            headers: {
              "Content-Type": newMemberFile.type || "image/jpeg",
            },
          });
        }
        queryClient.invalidateQueries({ queryKey: ["group-board"] });
        setNewMember({
          edit: false,
          title: "",
          image: false,
          job_title: "",
          content: "",
          loading: false,
        });
        setNewMemberFile(null);
        setNewMemberPreview(null);
      } else {
        alert("Failed to create group board member");
        setNewMember({ ...newMember, edit: true, loading: false });
      }
    } catch (error) {
      console.error("Failed to create group board member", error);
      setNewMember({ ...newMember, loading: false });
    }
  };

  const { mutate: editTeam, isPending } = useMutation({
    mutationFn: (data: {
      id: string;
      title: string;
      job_title: string;
      content: string;
      date: string;
    }) => axios.post("/api/admin/group_board/edit", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-board"] });
      setEdit({ ...edit, edit: false });
    },
    onError: () => {
      console.error("Failed to edit group board member");
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
        .flatMap((page) => (page?.posts as PostProps[]) ?? [])
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

  // Removed callSortUpdateApi and all drag and drop handlers

  const handleDelete = async (id: string, date: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this group board member? \nThis action cannot be undone!"
      )
    ) {
      return;
    }
    try {
      await axios.post("/api/admin/group_board/delete", { id, date });
      queryClient.invalidateQueries({ queryKey: ["group-board"] });
      setEdit({ ...edit, edit: false });
    } catch (error) {
      console.error("Failed to delete group board member", error);
      alert("Failed to delete group board member");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col pb-10 pt-25 px-10 z-20">
        <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
          Group Board Members
        </h1>
        <p className="text-sm text-center flex items-center justify-center mb-5 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white ">
          Total members: {data?.pages[0].count ?? 0}
        </p>

        {/* <p className="text-sm text-black text-center mb-10">
          Drag and drop to reorder the group board members.
        </p> */}
        <div className="w-full h-fit flex-col gap-5 flex justify-center items-center">
          {isLoading ? (
            <>
              <p>Loading...</p>
            </>
          ) : (
            <>
              <div
                className="w-fit h-fit flex flex-row gap-2 items-center justify-center bg-navy/10 hover:bg-navy/20 p-2 rounded-full cursor-pointer transition-all duration-150"
                onClick={() => {
                  setNewMemberPreview(null);
                  setNewMemberFile(null);
                  setNewMember({ ...newMember, edit: !newMember.edit });
                }}
              >
                <button className="bg-navy w-fit text-white p-2 cursor-pointer rounded-full">
                  {" "}
                  {newMember.edit ? (
                    <XIcon className="w-4 h-4" />
                  ) : (
                    <PlusIcon className="w-4 h-4" />
                  )}
                </button>
                <p className="text-sm text-navy font-bold">
                  {newMember.edit ? "Close" : "Add a new member"}
                </p>
              </div>

              {newMember.edit && (
                <div
                  className="w-full px-20 py-10 bg-white/90 flex flex-col md:flex-row justify-center items-center rounded-2xl shadow-lg p-6 gap-8 border border-navy/10 transition-all duration-150 overflow-hidden"
                  key={"edit-new-member"}
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
                      handleNewMemberImageFile(file);
                    }}
                    onClick={() => newMemberFileInputRef.current?.click()}
                  >
                    <Image
                      src={newMemberPreview || "/person.jpg"}
                      alt={newMember.title || "No title"}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="rounded-2xl w-52 h-52 object-cover border border-navy/20 shadow-sm"
                    />
                    <p className="mt-2 text-xs text-center text-navy/80 px-2">
                      Drag & drop or click to upload a new photo
                    </p>
                    <input
                      ref={newMemberFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        handleNewMemberImageFile(file);
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
                        value={newMember.title}
                        onChange={(e) =>
                          setNewMember({ ...newMember, title: e.target.value })
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
                        value={newMember.job_title}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            job_title: e.target.value,
                          })
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
                        content={newMember.content || ""}
                        onChange={(content) =>
                          setNewMember({ ...newMember, content })
                        }
                      />
                    </div>

                    <div className="flex flex-row gap-3 mt-4 items-center">
                      <button
                        onClick={() => void handleCreate()}
                        disabled={newMember.loading}
                        className="bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-2 rounded-full shadow transition-colors duration-150 cursor-pointer"
                      >
                        {newMember.loading ? "Creating..." : "Create"}
                      </button>
                      <button
                        onClick={() =>
                          setNewMember({ ...newMember, edit: false })
                        }
                        className="bg-white border border-navy text-navy px-6 py-2 rounded-full shadow hover:bg-navy/5 transition-colors duration-150 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!newMember.edit &&
                sortedTeam?.map((member: PostProps, index: number) => {
                  // Drag and drop code and state removed

                  return (
                    <>
                      {!edit.edit ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                          key={member.id.toString()}
                          className={`w-full bg-black/10 h-fit flex items-center rounded-lg p-4 gap-5 transition-all duration-150`}
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
                            className="rounded-md w-56 h-56 object-cover"
                            unoptimized
                          />
                          <div className="flex flex-col gap-1 h-full">
                            <p className="text-lg font-bold text-navy mt-5">
                              {member.title}
                            </p>
                            <p className="text-sm text-black font-bold">
                              {(() => {
                                const d = new Date(member.date);
                                const month = d.toLocaleString("en-US", {
                                  month: "long",
                                });
                                return `${d.getDate()} ${month} ${d.getFullYear()}`;
                              })()}
                            </p>
                            <button
                              onClick={() =>
                                window.open(`/news/${member.slug}`, "_blank")
                              }
                              className="bg-navy w-fit mt-auto flex text-white px-4 py-2 rounded-full shadow hover:bg-navy/90 transition-all duration-150 cursor-pointer"
                            >
                              view page
                            </button>
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
                            onClick={() => editFileInputRef.current?.click()}
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
                              ref={editFileInputRef}
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
                                  setEdit({
                                    ...edit,
                                    job_title: e.target.value,
                                  })
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
                                onClick={() =>
                                  setEdit({ ...edit, edit: false })
                                }
                                className="bg-white border border-navy text-navy px-6 py-2 rounded-full shadow hover:bg-navy/5 transition-colors duration-150 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(
                                    member.id.toString(),
                                    member.date.toString()
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow hover:bg-navy/5 transition-colors duration-150 cursor-pointer"
                              >
                                Delete
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
