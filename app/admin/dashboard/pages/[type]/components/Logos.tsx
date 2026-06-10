"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface LogoItem {
  image: string;
  alt: string;
}

interface LogosProps {
  type: string;
  rawLogos: Record<string, unknown>;
}

const emptyLogo = (): LogoItem => ({ image: "", alt: "" });

export default function Logos({ type, rawLogos }: LogosProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [draggingCard, setDraggingCard] = useState<number | null>(null);

  useEffect(() => {
    if (!rawLogos) return;
    setTitle((rawLogos.title as string) || "");
    const items = Array.isArray(rawLogos.items) ? rawLogos.items : [];
    setLogos(
      items.map((l: Record<string, unknown>) => ({
        image: (l.image as string) || "",
        alt: (l.alt as string) || "",
      })),
    );
  }, [rawLogos]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/logos/edit", {
        type,
        logos: { title, items: logos },
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save logos", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const updateLogo = (index: number, partial: Partial<LogoItem>) => {
    setLogos((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...partial } : l)),
    );
  };

  const addLogo = () => {
    setLogos((prev) => [...prev, emptyLogo()]);
  };

  const removeLogo = async (index: number) => {
    if (!confirm("Are you sure you want to remove this logo?")) return;
    const logo = logos[index];
    if (logo.image) {
      try {
        await axios.post("/api/admin/pages/image/delete", {
          key: `pages/${type}/${logo.image}`,
        });
      } catch {
        // image may already be deleted
      }
    }
    setLogos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (cardIndex: number, file: File) => {
    const oldImage = logos[cardIndex].image;
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

      if (oldImage) {
        try {
          await axios.post("/api/admin/pages/image/delete", {
            key: `pages/${type}/${oldImage}`,
          });
        } catch {
          // old image may already be deleted
        }
      }

      updateLogo(cardIndex, { image: uuid });
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const removeImage = async (cardIndex: number) => {
    const imageKey = logos[cardIndex].image;
    if (!imageKey) return;
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
    } catch {
      // image may already be deleted
    }
    updateLogo(cardIndex, { image: "" });
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Logo Band Details</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Heading</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trusted by students from top UK universities"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
            />
          </div>
        </div>
      </section>

      <h3 className="text-lg font-semibold text-navy">Logos</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logos.map((logo, idx) => (
          <section
            key={idx}
            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-navy">
                Logo {idx + 1}
                {logo.alt
                  ? ` — ${logo.alt.slice(0, 30)}${logo.alt.length > 30 ? "..." : ""}`
                  : ""}
              </h2>
              <button
                type="button"
                onClick={() => removeLogo(idx)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                title="Remove logo"
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Name (alt text)
                </label>
                <input
                  type="text"
                  value={logo.alt}
                  onChange={(e) => updateLogo(idx, { alt: e.target.value })}
                  placeholder="e.g. University College London"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Logo image
                </label>
                {logo.image ? (
                  <div className="relative group w-40 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                    <Image
                      src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${logo.image}`}
                      alt={logo.alt || `Logo ${idx + 1}`}
                      width={0}
                      height={0}
                      sizes="160px"
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                      title="Remove image"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      draggingCard === idx
                        ? "border-navy bg-navy/5"
                        : "border-gray-300 hover:border-navy/40 hover:bg-gray-50"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDraggingCard(idx);
                    }}
                    onDragLeave={() => setDraggingCard(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDraggingCard(null);
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
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      <button
        type="button"
        onClick={addLogo}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-navy/40 hover:text-navy hover:bg-navy/5 transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <PlusIcon className="w-4 h-4" />
        Add Logo
      </button>

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
