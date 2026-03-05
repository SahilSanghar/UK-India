"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

export default function Client({ type }: { type: string }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-pages", type],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/pages/get_by_type?type=${type}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const [lander, setLander] = useState<{
    title: string[];
    des: string[];
    image: string[];
  }>({ title: [], des: [], image: [] });

  const rawLander = data?.page?.lander;
  useEffect(() => {
    setLander({
      title: Array.isArray(rawLander?.title) ? rawLander.title : [],
      des: Array.isArray(rawLander?.des) ? rawLander.des : [],
      image: Array.isArray(rawLander?.image) ? rawLander.image : [],
    });
  }, [rawLander]);

  const handleLanderEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    item: string,
  ) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    if (item === "title") {
      const newTitle = formData.get("title") as string;
      const updatedTitiles = [...lander.title, newTitle];

      try {
        const res = await axios.post("/api/admin/pages/edit", {
          type,
          lander: {
            title: updatedTitiles,
            des: lander.des,
            image: lander.image,
          },
        });

        if (res.status != 200) {
          throw new Error("Failed to edit title");
        }

        form.reset();

        queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });
      } catch (error) {
        form.reset();
        console.error("Failed to edit title", error);
      }
    }

    if (item === "description") {
      const newDescription = formData.get("description") as string;
      const updatedDescriptions = [...lander.des, newDescription];

      try {
        const res = await axios.post("/api/admin/pages/edit", {
          type,
          lander: {
            title: lander.title,
            des: updatedDescriptions,
            image: lander.image,
          },
        });
        if (res.status !== 200) throw new Error("Failed to edit description");
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });
      } catch (error) {
        form.reset();
        console.error("Failed to edit description", error);
      }
    }
  };

  const [editing, setEditing] = useState<{
    field: string;
    index: number;
    value: string;
  } | null>(null);

  const handleLanderItemEdit = async (
    field: string,
    index: number,
    newValue: string,
  ) => {
    if (!newValue.trim()) return;

    if (field === "title") {
      const updatedTitles = lander.title.map((t, i) =>
        i === index ? newValue : t,
      );
      try {
        const res = await axios.post("/api/admin/pages/edit", {
          type,
          lander: {
            title: updatedTitles,
            des: lander.des,
            image: lander.image,
          },
        });
        if (res.status !== 200) throw new Error("Failed to edit title");
        queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });
      } catch (error) {
        console.error("Failed to edit title", error);
      }
    }

    if (field === "description") {
      const updatedDescriptions = lander.des.map((d, i) =>
        i === index ? newValue : d,
      );
      try {
        const res = await axios.post("/api/admin/pages/edit", {
          type,
          lander: {
            title: lander.title,
            des: updatedDescriptions,
            image: lander.image,
          },
        });
        if (res.status !== 200) throw new Error("Failed to edit description");
        queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });
      } catch (error) {
        console.error("Failed to edit description", error);
      }
    }

    setEditing(null);
  };

  const handlelanderDelete = async (item: string, index: number) => {
    if (item === "title") {
      const updatedTitles = lander.title.filter((_, i) => i !== index);
      try {
        const res = await axios.post("/api/admin/pages/edit", {
          type,
          lander: {
            title: updatedTitles,
            des: lander.des,
            image: lander.image,
          },
        });

        if (res.status != 200) {
          throw new Error("Failed to delete title");
        }

        queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });
      } catch (error) {
        console.error("Failed to delete title", error);
      }
    }
    if (item === "description") {
      const updatedDescriptions = lander.des.filter((_, i) => i !== index);
      try {
        const res = await axios.post("/api/admin/pages/edit", {
          type,
          lander: {
            title: lander.title,
            des: updatedDescriptions,
            image: lander.image,
          },
        });

        if (res.status != 200) {
          throw new Error("Failed to delete description");
        }

        queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });
      } catch (error) {
        console.error("Failed to delete description", error);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pb-10 pt-25 px-10 z-20">
      <h1 className="text-4xl font-bold flex items-center justify-center pt-10 mb-2 text-navy capitalize">
        Edit {type.replace(/-/g, " ")}
      </h1>

      <div className="w-full flex flex-col gap-2">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading {type.replace(/-/g, " ")} page</p>}

        {data?.page?.lander && (
          <div className="w-full flex flex-col gap-2 border border-gray-300 rounded-md p-4 mt-5">
            <h1 className="text-2xl font-bold">Lander</h1>

            <div className="w-full flex flex-col gap-2 mt-4">
              {lander.title.length === 0 && (
                <span className="text-gray-400">No titles added yet.</span>
              )}
              <h2 className="text-lg font-bold">Titles</h2>
              <form
                action=""
                className="flex flex-row items-center justify-center gap-2"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  handleLanderEdit(e, "title");
                }}
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="w-full p-2 border font-normal border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="bg-navy text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </form>
              {lander.title.map((title: string, index: number) => (
                <div
                  className="text-base font-medium rounded-full bg-navy/10 border flex flex-row items-center justify-center px-4 py-2 text-black"
                  key={`${title}-${index}`}
                >
                  {editing?.field === "title" && editing.index === index ? (
                    <form
                      className="flex flex-row items-center gap-2 w-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleLanderItemEdit("title", index, editing.value);
                      }}
                    >
                      <input
                        type="text"
                        value={editing.value}
                        onChange={(e) =>
                          setEditing((prev) =>
                            prev ? { ...prev, value: e.target.value } : prev,
                          )
                        }
                        autoFocus
                        className="w-full p-1 border border-gray-300 rounded-md font-normal"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditing(null);
                        }}
                      />
                      <button
                        type="submit"
                        className="text-green-600 cursor-pointer flex items-center justify-center"
                        title="Save"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="text-red-500 cursor-pointer flex items-center justify-center"
                        onClick={() => setEditing(null)}
                        title="Cancel"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <>
                      {title}
                      <div className="flex flex-row items-center justify-center gap-2 ml-auto">
                        <button
                          className="text-blue-500 cursor-pointer ml-2 flex items-center justify-center"
                          onClick={() =>
                            setEditing({ field: "title", index, value: title })
                          }
                          title="Edit Title"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-500 cursor-pointer ml-2 flex items-center justify-center"
                          onClick={() => handlelanderDelete("title", index)}
                          title="Delete Title"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full flex flex-col gap-2 mt-4">
              {lander.title.length === 0 && (
                <span className="text-gray-400">
                  No Descriptions added yet.
                </span>
              )}
              <h2 className="text-lg font-bold">Descriptions</h2>
              <form
                action=""
                className="flex flex-row items-center justify-center gap-2"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  handleLanderEdit(e, "description");
                }}
              >
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="bg-navy text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              </form>
              {lander.des.map((des: string, index: number) => (
                <div
                  className="text-base font-medium rounded-full bg-navy/10 border flex flex-row items-center justify-center px-4 py-2 text-black"
                  key={`${des}-${index}`}
                >
                  {editing?.field === "description" &&
                  editing.index === index ? (
                    <form
                      className="flex flex-row items-center gap-2 w-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleLanderItemEdit(
                          "description",
                          index,
                          editing.value,
                        );
                      }}
                    >
                      <input
                        type="text"
                        value={editing.value}
                        onChange={(e) =>
                          setEditing((prev) =>
                            prev ? { ...prev, value: e.target.value } : prev,
                          )
                        }
                        autoFocus
                        className="w-full p-1 border border-gray-300 rounded-md font-normal"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditing(null);
                        }}
                      />
                      <button
                        type="submit"
                        className="text-green-600 cursor-pointer flex items-center justify-center"
                        title="Save"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="text-red-500 cursor-pointer flex items-center justify-center"
                        onClick={() => setEditing(null)}
                        title="Cancel"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <>
                      {des}
                      <div className="flex flex-row items-center justify-center gap-2 ml-auto">
                        <button
                          className="text-blue-500 cursor-pointer ml-2 flex items-center justify-center"
                          onClick={() =>
                            setEditing({
                              field: "description",
                              index,
                              value: des,
                            })
                          }
                          title="Edit Description"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-500 cursor-pointer ml-2 flex items-center justify-center"
                          onClick={() =>
                            handlelanderDelete("description", index)
                          }
                          title="Delete Description"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
