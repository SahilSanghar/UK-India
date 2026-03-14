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
  url: string;
  filters: string[];
  date: string;
  sort: string;
}

export default function Page() {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["members"],
      queryFn: ({ pageParam }) =>
        axios
          .get("/api/admin/members?admin=true", {
            params: {
              limit: 0,
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

  const [sortedTeam, setSortedTeam] = useState<PostProps[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [newMember, setNewMember] = useState({
    edit: false,
    title: "",
    image: false,
    content: "",
    url: "",
    loading: false,
  });
  const [newMemberFile, setNewMemberFile] = useState<File | null>(null);
  const [newMemberPreview, setNewMemberPreview] = useState<string | null>(null);
  const [newMemberFilterInput, setNewMemberFilterInput] = useState<string>("");
  const newMemberFileInputRef = useRef<HTMLInputElement | null>(null);

  const [edit, setEdit] = useState({
    edit: false,
    id: "",
    title: "",
    image: "",
    content: "",
    url: "",
    date: "",
    filters: [] as string[],
    sortIndex: 0,
    originalIndex: 0,
  });
  const [filterInputString, setFilterInputString] = useState<string>("");
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
      key: `members/${id}`,
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
    queryClient.invalidateQueries({ queryKey: ["members"] });
  };

  const handleCreate = async () => {
    setNewMember({ ...newMember, loading: true });
    try {
      const filtersArray = newMemberFilterInput
        ? newMemberFilterInput
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
        : [];
      const response = await axios.post("/api/admin/members/create", {
        title: newMember.title,
        image: Boolean(newMemberFile),
        content: newMember.content,
        url: newMember.url,
        filters: filtersArray.map((f) => f.toLowerCase()),
        date: new Date().toISOString(),
        sort: generateKeyBetween(
          sortedTeam[sortedTeam.length - 1]?.sort ?? null,
          null,
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
        queryClient.invalidateQueries({ queryKey: ["members"] });
        setNewMember({
          edit: false,
          title: "",
          image: false,
          content: "",
          url: "",
          loading: false,
        });
        setNewMemberFile(null);
        setNewMemberPreview(null);
        setNewMemberFilterInput("");
      } else {
        alert("Failed to create team member");
        setNewMember({ ...newMember, edit: true, loading: false });
      }
    } catch (error) {
      console.error("Failed to create team member", error);
      setNewMember({ ...newMember, loading: false });
    }
  };

  const { mutateAsync: editTeamAsync, isPending } = useMutation({
    mutationFn: (data: {
      id: string;
      title: string;
      content: string;
      url: string;
      date: string;
      filters: string[];
    }) => axios.post("/api/admin/members/edit", data),
  });

  const handleEdit = async () => {
    try {
      await editTeamAsync({
        id: edit.id,
        title: edit.title,
        content: edit.content,
        url: edit.url,
        date: edit.date,
        filters: Array.isArray(edit.filters)
          ? edit.filters.map((f) => (typeof f === "string" ? f.toLowerCase() : f))
          : [],
      });
    } catch {
      console.error("Failed to edit member");
      return;
    }

    const targetIndex = edit.sortIndex - 1;
    if (targetIndex !== edit.originalIndex && targetIndex >= 0 && targetIndex < sortedTeam.length) {
      const updated = [...sortedTeam];
      const [moved] = updated.splice(edit.originalIndex, 1);
      updated.splice(targetIndex, 0, moved);

      const leftSort = updated[targetIndex - 1]?.sort ?? null;
      const rightSort = updated[targetIndex + 1]?.sort ?? null;

      setSortedTeam(updated);
      await callSortUpdateApi(leftSort, rightSort, edit.id, edit.date);
    }

    queryClient.invalidateQueries({ queryKey: ["members"] });
    setEdit((prev) => ({ ...prev, edit: false }));
  };

  useEffect(() => {
    const nextTeam =
      data?.pages
        .flatMap((page) => (page?.members as PostProps[]) ?? [])
        ?.filter(Boolean) ?? [];

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
    date: string,
  ) => {
    try {
      await axios.post("/api/admin/members/sort", { left, right, id, date });
    } catch (error) {
      console.error("Failed to update team sort order", error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["members"] });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();

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

      const leftSort = updated[index - 1]?.sort ?? null;
      const rightSort = updated[index + 1]?.sort ?? null;
      void callSortUpdateApi(
        leftSort,
        rightSort,
        updated[index].id.toString(),
        updated[index].date.toString(),
      );

      return updated;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDelete = async (id: string, date: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this team member? \nThis action cannot be undone!",
      )
    ) {
      return;
    }
    try {
      await axios.post("/api/admin/members/delete", { id, date });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setEdit({ ...edit, edit: false });
    } catch (error) {
      console.error("Failed to delete team member", error);
      alert("Failed to delete team member");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col pb-10 pt-25 px-10 z-20">
        <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
          Members
        </h1>
        <p className="text-sm text-center flex items-center justify-center mb-5 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white ">
          Total members: {data?.pages[0].count ?? 0}
        </p>

        <p className="text-sm text-black text-center mb-10">
          Drag and drop to reorder the members.
        </p>
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
                  setNewMemberFilterInput("");
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
                  className=" w-full px-20 py-10 bg-white/90 flex flex-col md:flex-row justify-center items-center rounded-2xl shadow-lg p-6 gap-8 border border-navy/10 transition-all duration-150 overflow-hidden"
                  key={"edit-new-member"}
                >
                  <div
                    className={`w-56 bg-red-200 h-56 mb-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
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
                        Title
                      </label>
                      <input
                        type="text"
                        value={newMember.title}
                        onChange={(e) =>
                          setNewMember({ ...newMember, title: e.target.value })
                        }
                        placeholder="Title"
                        className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all  placeholder:text-navy/40"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="url"
                        className="text-sm md:text-base text-navy font-bold mb-1"
                      >
                        URL
                      </label>
                      <input
                        type="text"
                        id="url"
                        value={newMember.url}
                        onChange={(e) =>
                          setNewMember({ ...newMember, url: e.target.value })
                        }
                        placeholder="https://example.com"
                        className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all placeholder:text-navy/40"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="filters"
                        className="text-sm md:text-base text-navy font-bold mb-1"
                      >
                        Filters (comma-separated)
                      </label>
                      <input
                        type="text"
                        id="filters"
                        value={newMemberFilterInput}
                        onChange={(e) =>
                          setNewMemberFilterInput(e.target.value)
                        }
                        placeholder="E.g. Director, Manager, India"
                        className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all placeholder:text-navy/40"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="content"
                        className="text-sm md:text-base text-navy font-bold mb-1"
                      >
                        Content
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
                        onClick={() => {
                          setNewMember({ ...newMember, edit: false });
                          setNewMemberFilterInput("");
                        }}
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
                  const isDragged = draggedIndex === index;
                  const isDragOver = dragOverIndex === index;

                  return (
                    <React.Fragment key={member.id.toString()}>
                      {!edit.edit ? (
                        <div className="w-full">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
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
                              {member.url && (
                                <p className="text-sm text-black">{member.url}</p>
                              )}
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
                                  content: member.content,
                                  url: member.url ?? "",
                                  date: member.date,
                                  filters: member.filters,
                                  sortIndex: index + 1,
                                  originalIndex: index,
                                });
                                setFilterInputString(
                                  (member.filters || []).join(", "),
                                );
                              }}
                            >
                              <p className="text-black font-medium">Edit</p>
                            </div>
                          </motion.div>
                        </div>
                      ) : edit.id === member.id.toString() ? (
                        <div className="w-full px-20 py-10 bg-white/90 flex flex-col md:flex-row justify-center items-center rounded-2xl shadow-lg p-6 gap-8 border border-navy/10 transition-all duration-150 overflow-hidden">
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
                                Title
                              </label>
                              <input
                                type="text"
                                value={edit.title}
                                onChange={(e) =>
                                  setEdit({ ...edit, title: e.target.value })
                                }
                                placeholder="Title"
                                className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all  placeholder:text-navy/40"
                              />
                            </div>

                            <div className="flex flex-col">
                              <label
                                htmlFor="url"
                                className="text-sm md:text-base text-navy font-bold mb-1"
                              >
                                URL
                              </label>
                              <input
                                type="text"
                                id="url"
                                value={edit.url}
                                onChange={(e) =>
                                  setEdit({ ...edit, url: e.target.value })
                                }
                                placeholder="https://example.com"
                                className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all placeholder:text-navy/40"
                              />
                            </div>

                            <div className="flex flex-col">
                              <label
                                htmlFor="filters"
                                className="text-sm md:text-base text-navy font-bold mb-1"
                              >
                                Filters (comma-separated)
                              </label>
                              <input
                                type="text"
                                value={filterInputString}
                                onChange={(e) => {
                                  setFilterInputString(e.target.value);
                                  const filtersArray = e.target.value
                                    ? e.target.value
                                        .split(",")
                                        .map((f) => f.trim())
                                        .filter(Boolean)
                                    : [];
                                  setEdit({
                                    ...edit,
                                    filters: filtersArray,
                                  });
                                }}
                                placeholder="E.g. Director, Manager, India"
                                className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all placeholder:text-navy/40"
                              />
                            </div>

                            <div className="flex flex-col">
                              <label
                                htmlFor="sortIndex"
                                className="text-sm md:text-base text-navy font-bold mb-1"
                              >
                                Sort Position
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={sortedTeam.length}
                                value={edit.sortIndex}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val)) {
                                    setEdit({ ...edit, sortIndex: val });
                                  }
                                }}
                                placeholder={`1 – ${sortedTeam.length}`}
                                className="text-base font-medium text-black border border-navy/30 focus:border-navy outline-none w-full px-4 py-2 rounded-lg transition-all placeholder:text-navy/40"
                              />
                              <p className="text-xs text-navy/60 mt-1">
                                Currently at position {edit.originalIndex + 1} of {sortedTeam.length}. Change the number to reorder.
                              </p>
                            </div>

                            <div className="flex flex-col">
                              <label
                                htmlFor="content"
                                className="text-sm md:text-base text-navy font-bold mb-1"
                              >
                                Content
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
                                onClick={() => {
                                  setEdit({ ...edit, edit: false });
                                  setFilterInputString("");
                                }}
                                className="bg-white border border-navy text-navy px-6 py-2 rounded-full shadow hover:bg-navy/5 transition-colors duration-150 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(
                                    member.id.toString(),
                                    member.date.toString(),
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow transition-colors duration-150 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </React.Fragment>
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
