"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface WhatCard {
  title: string;
  des: string;
  link: string;
  images: string[];
}

interface WhatData {
  title: string;
  des: string;
  cards: WhatCard[];
}

interface WhatProps {
  type: string;
  rawWhat: Record<string, unknown> | undefined;
}

const emptyCard = (): WhatCard => ({
  title: "",
  des: "",
  link: "",
  images: [],
});

export default function What({ type, rawWhat }: WhatProps) {
  const queryClient = useQueryClient();

  const [what, setWhat] = useState<WhatData>({
    title: "",
    des: "",
    cards: [],
  });
  const [saving, setSaving] = useState(false);
  const [draggingCard, setDraggingCard] = useState<number | null>(null);

  useEffect(() => {
    if (!rawWhat) return;
    const rawCards = Array.isArray(rawWhat.cards)
      ? (rawWhat.cards as Record<string, unknown>[])
      : [];

    setWhat({
      title: (rawWhat.title as string) || "",
      des: (rawWhat.des as string) || "",
      cards: rawCards.map((c) => ({
        title: (c.title as string) || "",
        des: (c.des as string) || "",
        link: (c.link as string) || "",
        images: Array.isArray(c.images) ? (c.images as string[]) : [],
      })),
    });
  }, [rawWhat]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/what/edit", {
        type,
        what,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save what section", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (index: number, partial: Partial<WhatCard>) => {
    setWhat((prev) => ({
      ...prev,
      cards: prev.cards.map((c, i) =>
        i === index ? { ...c, ...partial } : c,
      ),
    }));
  };

  const addCard = () => {
    setWhat((prev) => ({ ...prev, cards: [...prev.cards, emptyCard()] }));
  };

  const removeCard = async (index: number) => {
    if (!confirm("Are you sure you want to remove this card?")) return;
    const card = what.cards[index];
    for (const img of card.images) {
      try {
        await axios.post("/api/admin/pages/image/delete", {
          key: `pages/${type}/${img}`,
        });
      } catch {
        // image may already be deleted
      }
    }
    setWhat((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  };

  const handleCardImageUpload = async (cardIndex: number, file: File) => {
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

      updateCard(cardIndex, {
        images: [...what.cards[cardIndex].images, uuid],
      });
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const removeCardImage = async (cardIndex: number, imageIndex: number) => {
    const imageKey = what.cards[cardIndex].images[imageIndex];
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
    } catch {
      // image may already be deleted, continue
    }
    updateCard(cardIndex, {
      images: what.cards[cardIndex].images.filter((_, i) => i !== imageIndex),
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      {/* ── Section Header Fields ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Section Header</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={what.title}
              onChange={(e) =>
                setWhat((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. What we do"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              value={what.des}
              onChange={(e) =>
                setWhat((prev) => ({ ...prev, des: e.target.value }))
              }
              placeholder="Short description for this section..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition resize-none"
            />
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      {what.cards.map((card, cardIdx) => (
        <section
          key={cardIdx}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">
              Card {cardIdx + 1}
              {card.title ? ` — ${card.title}` : ""}
            </h2>
            <button
              type="button"
              onClick={() => removeCard(cardIdx)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
              title="Remove card"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) =>
                    updateCard(cardIdx, { title: e.target.value })
                  }
                  placeholder="Card title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Link
                </label>
                <input
                  type="text"
                  value={card.link}
                  onChange={(e) =>
                    updateCard(cardIdx, { link: e.target.value })
                  }
                  placeholder="/page-link or https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                value={card.des}
                onChange={(e) =>
                  updateCard(cardIdx, { des: e.target.value })
                }
                placeholder="Card description..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition resize-none"
              />
            </div>

            {/* Card Images */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                Images
              </label>
              <label
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  draggingCard === cardIdx
                    ? "border-navy bg-navy/5"
                    : "border-gray-300 hover:border-navy/40 hover:bg-gray-50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggingCard(cardIdx);
                }}
                onDragLeave={() => setDraggingCard(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDraggingCard(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    handleCardImageUpload(cardIdx, file);
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
                    if (file) handleCardImageUpload(cardIdx, file);
                    e.target.value = "";
                  }}
                />
              </label>
              {card.images.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No images added yet.
                </p>
              )}
              {card.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-1">
                  {card.images.map((img, imgIdx) => (
                    <div
                      key={`${img}-${imgIdx}`}
                      className="relative group w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <Image
                        src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${img}`}
                        alt={`Card ${cardIdx + 1} image ${imgIdx + 1}`}
                        width={0}
                        height={0}
                        sizes="112px"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeCardImage(cardIdx, imgIdx)}
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

      {/* ── Add Card ── */}
      <button
        type="button"
        onClick={addCard}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-navy/40 hover:text-navy hover:bg-navy/5 transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <PlusIcon className="w-4 h-4" />
        Add Card
      </button>

      {/* ── Save ── */}
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
