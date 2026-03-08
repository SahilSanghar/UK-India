"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface WhoCard {
  title: string;
  image: string;
}

interface WhoData {
  title: string;
  cards: WhoCard[];
}

interface WhoProps {
  type: string;
  rawWho: Record<string, unknown>;
}

const emptyCard = (): WhoCard => ({
  title: "",
  image: "",
});

export default function Who({ type, rawWho }: WhoProps) {
  const queryClient = useQueryClient();

  const [who, setWho] = useState<WhoData>({ title: "", cards: [] });
  const [saving, setSaving] = useState(false);
  const [draggingCard, setDraggingCard] = useState<number | null>(null);

  useEffect(() => {
    if (!rawWho) return;
    const rawCards = Array.isArray(rawWho.cards)
      ? (rawWho.cards as Record<string, unknown>[])
      : [];

    setWho({
      title: (rawWho.title as string) || "",
      cards: rawCards.map((c) => ({
        title: (c.title as string) || "",
        image: (c.image as string) || "",
      })),
    });
  }, [rawWho]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/who/edit", {
        type,
        who,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save who section", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (index: number, partial: Partial<WhoCard>) => {
    setWho((prev) => ({
      ...prev,
      cards: prev.cards.map((c, i) =>
        i === index ? { ...c, ...partial } : c,
      ),
    }));
  };

  const addCard = () => {
    setWho((prev) => ({ ...prev, cards: [...prev.cards, emptyCard()] }));
  };

  const removeCard = async (index: number) => {
    if (!confirm("Are you sure you want to remove this card?")) return;
    const card = who.cards[index];
    if (card.image) {
      try {
        await axios.post("/api/admin/pages/image/delete", {
          key: `pages/${type}/${card.image}`,
        });
      } catch {
        // image may already be deleted
      }
    }
    setWho((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (cardIndex: number, file: File) => {
    const oldImage = who.cards[cardIndex].image;
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

      updateCard(cardIndex, { image: uuid });
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const removeImage = async (cardIndex: number) => {
    const imageKey = who.cards[cardIndex].image;
    if (!imageKey) return;
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
    } catch {
      // image may already be deleted
    }
    updateCard(cardIndex, { image: "" });
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Section Title</h2>
        </div>
        <div className="p-6">
          <input
            type="text"
            value={who.title}
            onChange={(e) =>
              setWho((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g. Who we are"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
          />
        </div>
      </section>

      {who.cards.map((card, cardIdx) => (
        <section
          key={cardIdx}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">
              Card {cardIdx + 1}
              {card.title ? ` — ${card.title.slice(0, 40)}${card.title.length > 40 ? "..." : ""}` : ""}
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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Title</label>
              <textarea
                value={card.title}
                onChange={(e) =>
                  updateCard(cardIdx, { title: e.target.value })
                }
                placeholder="Card title / description text..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Image</label>
              {card.image ? (
                <div className="relative group w-48 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${card.image}`}
                    alt={`Card ${cardIdx + 1}`}
                    width={0}
                    height={0}
                    sizes="192px"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(cardIdx)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                    title="Remove image"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
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
                      handleImageUpload(cardIdx, file);
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
                      if (file) handleImageUpload(cardIdx, file);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={addCard}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-navy/40 hover:text-navy hover:bg-navy/5 transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <PlusIcon className="w-4 h-4" />
        Add Card
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
