"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  CheckIcon,
  PencilIcon,
  Trash2Icon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface LanderData {
  title: string[];
  title2: string[];
  des: string[];
  image: string[];
  button: { enable: boolean; text: string; link: string };
  flip: boolean;
}

interface LanderProps {
  type: string;
  rawLander: Record<string, unknown> | undefined;
  rawButton: Record<string, unknown> | undefined;
  rawFlip: boolean | undefined;
}

export default function Lander({
  type,
  rawLander,
  rawButton,
  rawFlip,
}: LanderProps) {
  const queryClient = useQueryClient();

  const [lander, setLander] = useState<LanderData>({
    title: [],
    title2: [],
    des: [],
    image: [],
    button: { enable: false, text: "", link: "" },
    flip: false,
  });

  useEffect(() => {
    setLander({
      title: Array.isArray(rawLander?.title)
        ? (rawLander?.title as string[])
        : [],
      title2: Array.isArray(rawLander?.title2)
        ? (rawLander?.title2 as string[])
        : [],
      des: Array.isArray(rawLander?.des) ? (rawLander?.des as string[]) : [],
      image: Array.isArray(rawLander?.image)
        ? (rawLander?.image as string[])
        : [],
      button: {
        enable: (rawButton?.enable as boolean) || false,
        text: (rawButton?.text as string) || "",
        link: (rawButton?.link as string) || "",
      },
      flip: rawFlip || false,
    });
  }, [rawLander, rawButton, rawFlip]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const saveLander = async (partial: {
    title: string[];
    title2: string[];
    des: string[];
    image: string[];
  }) => {
    const res = await axios.post("/api/admin/pages/edit", {
      type,
      lander: partial,
    });
    if (res.status !== 200) throw new Error("Failed to save lander");
    invalidate();
  };

  // ── Titles & Descriptions ──

  const handleLanderEdit = async (
    e: React.FormEvent<HTMLFormElement>,
    item: string,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (item === "title") {
      const updated = [...lander.title, formData.get("title") as string];
      try {
        await saveLander({ title: updated, title2: lander.title2, des: lander.des, image: lander.image });
        form.reset();
      } catch (error) {
        form.reset();
        console.error("Failed to edit title", error);
      }
    }

    if (item === "title2") {
      const updated = [...lander.title2, formData.get("title2") as string];
      try {
        await saveLander({ title: lander.title, title2: updated, des: lander.des, image: lander.image });
        form.reset();
      } catch (error) {
        form.reset();
        console.error("Failed to edit title2", error);
      }
    }

    if (item === "description") {
      const updated = [...lander.des, formData.get("description") as string];
      try {
        await saveLander({ title: lander.title, title2: lander.title2, des: updated, image: lander.image });
        form.reset();
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

    try {
      if (field === "title") {
        const updated = lander.title.map((t, i) =>
          i === index ? newValue : t,
        );
        await saveLander({ title: updated, title2: lander.title2, des: lander.des, image: lander.image });
      }
      if (field === "title2") {
        const updated = lander.title2.map((t, i) =>
          i === index ? newValue : t,
        );
        await saveLander({ title: lander.title, title2: updated, des: lander.des, image: lander.image });
      }
      if (field === "description") {
        const updated = lander.des.map((d, i) =>
          i === index ? newValue : d,
        );
        await saveLander({ title: lander.title, title2: lander.title2, des: updated, image: lander.image });
      }
    } catch (error) {
      console.error(`Failed to edit ${field}`, error);
    }
    setEditing(null);
  };

  const handleLanderDelete = async (item: string, index: number) => {
    try {
      if (item === "title") {
        const updated = lander.title.filter((_, i) => i !== index);
        await saveLander({ title: updated, title2: lander.title2, des: lander.des, image: lander.image });
      }
      if (item === "title2") {
        const updated = lander.title2.filter((_, i) => i !== index);
        await saveLander({ title: lander.title, title2: updated, des: lander.des, image: lander.image });
      }
      if (item === "description") {
        const updated = lander.des.filter((_, i) => i !== index);
        await saveLander({ title: lander.title, title2: lander.title2, des: updated, image: lander.image });
      }
    } catch (error) {
      console.error(`Failed to delete ${item}`, error);
    }
  };

  // ── Images ──

  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (file: File) => {
    const uuid = uuidv4();
    const imageKey = `pages/${type}/${uuid}`;

    try {
      const signedRes = await axios.post("/api/admin/team/image/signed", {
        key: imageKey,
      });
      if (!signedRes.data?.signedUrl) {
        alert("Failed to get signed url");
        return;
      }

      const uploadRes = await axios.put(signedRes.data.signedUrl, file, {
        headers: { "Content-Type": file.type },
      });
      if (uploadRes.status !== 200) {
        alert("Failed to upload image");
        return;
      }

      const updatedImages = [...lander.image, uuid];
      await saveLander({ title: lander.title, title2: lander.title2, des: lander.des, image: updatedImages });
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const handleImageDelete = async (imageKey: string, index: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
      const updatedImages = lander.image.filter((_, i) => i !== index);
      await saveLander({ title: lander.title, title2: lander.title2, des: lander.des, image: updatedImages });
    } catch (error) {
      alert("Failed to delete image: " + error);
    }
  };

  // ── Button ──

  const handleButtonEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const enable =
      formData.get("enable") === "on" || formData.get("enable") === "true";
    const text = formData.get("text") as string;
    const link = formData.get("link") as string;

    try {
      const res = await axios.post("/api/admin/pages/edit", {
        type,
        lander: { button: { enable, text, link } },
      });
      if (res.status !== 200) throw new Error("Failed to edit button");
      invalidate();
    } catch (error) {
      console.error("Failed to edit button", error);
      alert("Failed to edit button: " + error);
    }
  };

  // ── Flip ──

  const handleFlipEdit = async (checked: boolean) => {
    try {
      const res = await axios.post("/api/admin/pages/edit", {
        type,
        lander: { flip: checked },
      });
      if (res.status !== 200) throw new Error("Failed to edit flip");
      invalidate();
    } catch (error) {
      console.error("Failed to edit flip", error);
      alert("Failed to edit flip: " + error);
    }
  };

  // ── Render helpers ──

  const renderEditableItem = (
    field: string,
    value: string,
    index: number,
    label: string,
  ) => (
    <div
      className="text-base font-medium rounded-full bg-navy/10 border flex flex-row items-center justify-center px-4 py-2 text-black"
      key={`${value}-${index}`}
    >
      {editing?.field === field && editing.index === index ? (
        <form
          className="flex flex-row items-center gap-2 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleLanderItemEdit(field, index, editing.value);
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
          {value}
          <div className="flex flex-row items-center justify-center gap-2 ml-auto">
            <button
              className="text-blue-500 cursor-pointer ml-2 flex items-center justify-center"
              onClick={() => setEditing({ field, index, value })}
              title={`Edit ${label}`}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              className="text-red-500 cursor-pointer ml-2 flex items-center justify-center"
              onClick={() => handleLanderDelete(field, index)}
              title={`Delete ${label}`}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      {/* ── Titles ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Titles</h2>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <form
            className="flex flex-row items-center gap-2"
            onSubmit={(e) => handleLanderEdit(e, "title")}
          >
            <input
              type="text"
              name="title"
              placeholder="Add a new title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
            />
            <button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white text-sm font-medium px-5 py-2 rounded-lg transition shrink-0"
            >
              Add
            </button>
          </form>
          {lander.title.length === 0 && (
            <p className="text-sm text-gray-400 italic">No titles added yet.</p>
          )}
          <div className="flex flex-col gap-2">
            {lander.title.map((title, index) =>
              renderEditableItem("title", title, index, "Title"),
            )}
          </div>
        </div>
      </section>

      {/* ── Titles 2 ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Titles 2</h2>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <form
            className="flex flex-row items-center gap-2"
            onSubmit={(e) => handleLanderEdit(e, "title2")}
          >
            <input
              type="text"
              name="title2"
              placeholder="Add a new title 2..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
            />
            <button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white text-sm font-medium px-5 py-2 rounded-lg transition shrink-0"
            >
              Add
            </button>
          </form>
          {lander.title2.length === 0 && (
            <p className="text-sm text-gray-400 italic">No titles 2 added yet.</p>
          )}
          <div className="flex flex-col gap-2">
            {lander.title2.map((title, index) =>
              renderEditableItem("title2", title, index, "Title 2"),
            )}
          </div>
        </div>
      </section>

      {/* ── Descriptions ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Descriptions</h2>
        </div>
        <div className="p-6 flex flex-col gap-3">
          <form
            className="flex flex-row items-center gap-2"
            onSubmit={(e) => handleLanderEdit(e, "description")}
          >
            <input
              type="text"
              name="description"
              placeholder="Add a new description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
            />
            <button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white text-sm font-medium px-5 py-2 rounded-lg transition shrink-0"
            >
              Add
            </button>
          </form>
          {lander.des.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No descriptions added yet.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {lander.des.map((des, index) =>
              renderEditableItem("description", des, index, "Description"),
            )}
          </div>
        </div>
      </section>

      {/* ── Button Settings ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Button</h2>
        </div>
        <div className="p-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleButtonEdit}
          >
            <label className="inline-flex items-center gap-3 cursor-pointer w-fit">
              <input
                type="checkbox"
                name="enable"
                id="enable"
                checked={lander.button.enable}
                onChange={(e) =>
                  setLander((prev) => ({
                    ...prev,
                    button: { ...prev.button, enable: e.target.checked },
                  }))
                }
                className="form-checkbox h-5 w-5 rounded text-navy border-gray-300 focus:ring-navy transition"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable button
              </span>
            </label>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="text"
                className="text-sm font-medium text-gray-600"
              >
                Button Text
              </label>
              <input
                type="text"
                name="text"
                id="text"
                value={lander.button.text}
                onChange={(e) =>
                  setLander((prev) => ({
                    ...prev,
                    button: { ...prev.button, text: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="link"
                className="text-sm font-medium text-gray-600"
              >
                Button Link
              </label>
              <input
                type="text"
                name="link"
                id="link"
                value={lander.button.link}
                onChange={(e) =>
                  setLander((prev) => ({
                    ...prev,
                    button: { ...prev.button, link: e.target.value },
                  }))
                }
                placeholder="/internal-link or https://external-link.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>
            <button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white text-sm font-medium px-5 py-2 rounded-lg transition self-start"
            >
              Save
            </button>
          </form>
        </div>
      </section>

      {/* ── Flip ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Flip Layout</h2>
        </div>
        <div className="p-6">
          <label className="inline-flex items-center gap-3 cursor-pointer w-fit">
            <input
              type="checkbox"
              name="flip"
              id="flip"
              checked={lander.flip}
              onChange={async (e) => {
                const checked = e.target.checked;
                setLander((prev) => ({ ...prev, flip: checked }));
                await handleFlipEdit(checked);
              }}
              className="form-checkbox h-5 w-5 rounded text-navy border-gray-300 focus:ring-navy transition"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable flipped layout
            </span>
          </label>
        </div>
      </section>

      {/* ── Images ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Images</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <label
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isDragging
                ? "border-navy bg-navy/5"
                : "border-gray-300 hover:border-navy/40 hover:bg-gray-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                handleImageUpload(file);
              }
            }}
          >
            <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
              <UploadCloudIcon className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-navy">Click to upload</span>{" "}
                or drag and drop
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = "";
              }}
            />
          </label>
          {lander.image.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No images added yet.
            </p>
          )}
          {lander.image.length > 0 && (
            <div className="w-full flex flex-wrap gap-4">
              {lander.image.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative group w-100 aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                >
                  <Image
                    src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${image}`}
                    alt="Image"
                    width={0}
                    height={0}
                    sizes="100vh"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleImageDelete(image, index)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                    title="Delete Image"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
