"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "@/components/TextEditor";

interface FullscreenCardItem {
  title: string;
  image: string;
  buttonTxt: string;
  link: string;
}

interface FullscreenData {
  title: string;
  des: string;
  cards: FullscreenCardItem[];
}

interface FullscreenProps {
  type: string;
  rawFullscreen: Record<string, unknown>;
  fieldKey?: string;
  label?: string;
}

export default function Fullscreen({ type, rawFullscreen, fieldKey = "fullscreen", label = "Fullscreen" }: FullscreenProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [cards, setCards] = useState<FullscreenCardItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [draggingCard, setDraggingCard] = useState<number | null>(null);

  useEffect(() => {
    if (!rawFullscreen) return;
    setTitle((rawFullscreen.title as string) || "");
    setDes((rawFullscreen.des as string) || "");
    const rawCards = Array.isArray(rawFullscreen.cards)
      ? rawFullscreen.cards
      : [];
    setCards(
      rawCards.map((c: Record<string, unknown>) => ({
        title: (c.title as string) || "",
        image: (c.image as string) || "",
        buttonTxt: (c.buttonTxt as string) || "",
        link: (c.link as string) || "",
      })),
    );
  }, [rawFullscreen]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: FullscreenData = { title, des, cards };
      const res = await axios.post("/api/admin/pages/fullscreen/edit", {
        type,
        fullscreen: payload,
        fieldKey,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save fullscreen section", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (index: number, partial: Partial<FullscreenCardItem>) => {
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...partial } : c)),
    );
  };

  const addCard = () => {
    setCards((prev) => [
      ...prev,
      { title: "", image: "", buttonTxt: "", link: "" },
    ]);
  };

  const removeCard = async (index: number) => {
    const card = cards[index];
    if (card.image) {
      try {
        await axios.post("/api/admin/pages/image/delete", {
          key: `pages/${type}/${card.image}`,
        });
      } catch {
        // image may already be deleted
      }
    }
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (cardIndex: number, file: File) => {
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

      const oldImage = cards[cardIndex].image;
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
    const imageKey = cards[cardIndex].image;
    if (imageKey) {
      try {
        await axios.post("/api/admin/pages/image/delete", {
          key: `pages/${type}/${imageKey}`,
        });
      } catch {
        // image may already be deleted
      }
    }
    updateCard(cardIndex, { image: "" });
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">
            {label} Details
          </h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Fullscreen title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <TextEditor content={des || ""} onChange={(val) => setDes(val)} />
          </div>
        </div>
      </section>

      <h3 className="text-lg font-semibold text-navy">{label} Cards</h3>

      {cards.map((card, idx) => (
        <section
          key={idx}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">
              Card {idx + 1}
              {card.title
                ? ` — ${card.title.slice(0, 40)}${card.title.length > 40 ? "..." : ""}`
                : ""}
            </h2>
            <button
              type="button"
              onClick={() => removeCard(idx)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition cursor-pointer"
              title="Remove card"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Title</label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => updateCard(idx, { title: e.target.value })}
                placeholder="Card title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Button Text
                </label>
                <input
                  type="text"
                  value={card.buttonTxt}
                  onChange={(e) =>
                    updateCard(idx, { buttonTxt: e.target.value })
                  }
                  placeholder="e.g. Learn More"
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
                  onChange={(e) => updateCard(idx, { link: e.target.value })}
                  placeholder="/page-link or https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">Image</label>
              {card.image ? (
                <div className="relative group w-40 h-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${card.image}`}
                    alt={`Fullscreen card ${idx + 1} image`}
                    width={0}
                    height={0}
                    sizes="160px"
                    className="w-full h-full object-cover"
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

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addCard}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-navy/40 hover:bg-gray-50 text-gray-500 hover:text-navy text-sm font-medium px-5 py-3 rounded-xl transition cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          Add Card
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-navy hover:bg-navy/90 disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-xl transition cursor-pointer"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
