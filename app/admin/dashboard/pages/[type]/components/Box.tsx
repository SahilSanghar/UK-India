"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "@/components/TextEditor";

interface BoxItem {
  buttonTxt: string;
  content: string;
  image: string[];
  link: string;
  title: string;
}

interface BoxProps {
  type: string;
  rawBox: Record<string, unknown>[];
}

export default function Box({ type, rawBox }: BoxProps) {
  const queryClient = useQueryClient();

  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [draggingBox, setDraggingBox] = useState<number | null>(null);

  useEffect(() => {
    if (!rawBox) return;
    const items = Array.isArray(rawBox) ? rawBox : [];
    setBoxes(
      items.map((b) => ({
        buttonTxt: (b.buttonTxt as string) || "",
        content: (b.content as string) || "",
        image: Array.isArray(b.image) ? (b.image as string[]) : [],
        link: (b.link as string) || "",
        title: (b.title as string) || "",
      })),
    );
  }, [rawBox]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/box/edit", {
        type,
        box: boxes,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save box section", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const updateBox = (index: number, partial: Partial<BoxItem>) => {
    setBoxes((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...partial } : b)),
    );
  };

  const handleImageUpload = async (boxIndex: number, file: File) => {
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

      updateBox(boxIndex, {
        image: [...boxes[boxIndex].image, uuid],
      });
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const removeImage = async (boxIndex: number, imageIndex: number) => {
    const imageKey = boxes[boxIndex].image[imageIndex];
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
    } catch {
      // image may already be deleted
    }
    updateBox(boxIndex, {
      image: boxes[boxIndex].image.filter((_, i) => i !== imageIndex),
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      {boxes.map((box, idx) => (
        <section
          key={idx}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy">
              Box {idx + 1}
              {box.title
                ? ` — ${box.title.slice(0, 40)}${box.title.length > 40 ? "..." : ""}`
                : ""}
            </h2>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Title</label>
              <input
                type="text"
                value={box.title}
                onChange={(e) => updateBox(idx, { title: e.target.value })}
                placeholder="Box title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Content</label>
              <TextEditor
                content={box.content || ""}
                onChange={(content) => updateBox(idx, { content })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Button Text</label>
                <input
                  type="text"
                  value={box.buttonTxt}
                  onChange={(e) => updateBox(idx, { buttonTxt: e.target.value })}
                  placeholder="e.g. Learn More"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">Link</label>
                <input
                  type="text"
                  value={box.link}
                  onChange={(e) => updateBox(idx, { link: e.target.value })}
                  placeholder="/page-link or https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Images</label>
              <label
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  draggingBox === idx
                    ? "border-navy bg-navy/5"
                    : "border-gray-300 hover:border-navy/40 hover:bg-gray-50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggingBox(idx);
                }}
                onDragLeave={() => setDraggingBox(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDraggingBox(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    handleImageUpload(idx, file);
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                  <UploadCloudIcon className="w-6 h-6 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-navy">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(idx, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {box.image.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No images added yet.
                </p>
              )}
              {box.image.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-1">
                  {box.image.map((img, imgIdx) => (
                    <div
                      key={`${img}-${imgIdx}`}
                      className="relative group w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <Image
                        src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${img}`}
                        alt={`Box ${idx + 1} image ${imgIdx + 1}`}
                        width={0}
                        height={0}
                        sizes="112px"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx, imgIdx)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                        title="Remove image"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="bg-navy hover:bg-navy/90 disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-xl transition self-start cursor-pointer"
      >
        {saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}
