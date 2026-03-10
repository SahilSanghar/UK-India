"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, Trash2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface StatCard {
  title: string;
  valueBefore: string;
  valueAfter: string;
  number: number;
  des: string;
  disclaimer: string;
  link: string;
}

interface CircleItem {
  title: string;
  image: string;
}

interface StatsData {
  title: string;
  cards: StatCard[];
  circle: CircleItem[];
}

interface StatsProps {
  type: string;
  rawStats: Record<string, unknown>;
}

const emptyCircle = (): CircleItem => ({
  title: "",
  image: "",
});

export default function Stats({ type, rawStats }: StatsProps) {
  const queryClient = useQueryClient();

  const [stats, setStats] = useState<StatsData>({ title: "", cards: [], circle: [] });
  const [saving, setSaving] = useState(false);
  const [draggingCircle, setDraggingCircle] = useState<number | null>(null);

  useEffect(() => {
    if (!rawStats) return;
    const rawCards = Array.isArray(rawStats.cards)
      ? (rawStats.cards as Record<string, unknown>[])
      : [];
    const rawCircle = Array.isArray(rawStats.circle)
      ? (rawStats.circle as Record<string, unknown>[])
      : [];

    setStats({
      title: (rawStats.title as string) || "",
      cards: rawCards.map((s) => ({
        title: (s.title as string) || "",
        valueBefore: (s.valueBefore as string) || "",
        valueAfter: (s.valueAfter as string) || "",
        number: Number(s.number) || 0,
        des: (s.des as string) || "",
        disclaimer: (s.disclaimer as string) || "",
        link: (s.link as string) || "",
      })),
      circle: rawCircle.map((c) => ({
        title: (c.title as string) || "",
        image: (c.image as string) || "",
      })),
    });
  }, [rawStats]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/stats/edit", {
        type,
        stats,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save stats", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (index: number, partial: Partial<StatCard>) => {
    setStats((prev) => ({
      ...prev,
      cards: prev.cards.map((s, i) => (i === index ? { ...s, ...partial } : s)),
    }));
  };

  const updateCircle = (index: number, partial: Partial<CircleItem>) => {
    setStats((prev) => ({
      ...prev,
      circle: prev.circle.map((c, i) => (i === index ? { ...c, ...partial } : c)),
    }));
  };

  const addCircle = () => {
    setStats((prev) => ({ ...prev, circle: [...prev.circle, emptyCircle()] }));
  };

  const removeCircle = async (index: number) => {
    if (!confirm("Are you sure you want to remove this circle item?")) return;
    const item = stats.circle[index];
    if (item.image) {
      try {
        await axios.post("/api/admin/pages/image/delete", {
          key: `pages/${type}/${item.image}`,
        });
      } catch {
        // image may already be deleted
      }
    }
    setStats((prev) => ({
      ...prev,
      circle: prev.circle.filter((_, i) => i !== index),
    }));
  };

  const handleCircleImageUpload = async (circleIndex: number, file: File) => {
    const oldImage = stats.circle[circleIndex].image;
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

      updateCircle(circleIndex, { image: uuid });
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const removeCircleImage = async (circleIndex: number) => {
    const imageKey = stats.circle[circleIndex].image;
    if (!imageKey) return;
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
    } catch {
      // image may already be deleted
    }
    updateCircle(circleIndex, { image: "" });
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
            value={stats.title}
            onChange={(e) =>
              setStats((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Stats section title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
          />
        </div>
      </section>

      {stats.cards.map((stat, idx) => (
        <section
          key={idx}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-navy">
              Stat {idx + 1}
              {stat.title ? ` — ${stat.title}` : ""}
            </h2>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  value={stat.title}
                  onChange={(e) => updateCard(idx, { title: e.target.value })}
                  placeholder='e.g. "Over", "Recruited", "Revenue"'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Number
                </label>
                <input
                  type="number"
                  value={stat.number}
                  onChange={(e) =>
                    updateCard(idx, { number: Number(e.target.value) || 0 })
                  }
                  placeholder="e.g. 825"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Value Before
                </label>
                <input
                  type="text"
                  value={stat.valueBefore}
                  onChange={(e) =>
                    updateCard(idx, { valueBefore: e.target.value })
                  }
                  placeholder='e.g. "£" (appears before number)'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Value After
                </label>
                <input
                  type="text"
                  value={stat.valueAfter}
                  onChange={(e) =>
                    updateCard(idx, { valueAfter: e.target.value })
                  }
                  placeholder='e.g. "+", " Billion" (appears after number)'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                value={stat.des}
                onChange={(e) =>
                  updateCard(idx, { des: e.target.value })
                }
                placeholder="e.g. businesses and universities have used our services"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Disclaimer
                </label>
                <input
                  type="text"
                  value={stat.disclaimer}
                  onChange={(e) =>
                    updateCard(idx, { disclaimer: e.target.value })
                  }
                  placeholder='e.g. "(Last 6 years)"'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Link
                </label>
                <input
                  type="text"
                  value={stat.link}
                  onChange={(e) => updateCard(idx, { link: e.target.value })}
                  placeholder="/page-link or https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Circle Section */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Circle Items</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {stats.circle.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-gray-50/50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                <h3 className="text-sm font-semibold text-navy">
                  Circle {idx + 1}
                  {item.title ? ` — ${item.title.slice(0, 40)}${item.title.length > 40 ? "..." : ""}` : ""}
                </h3>
                <button
                  type="button"
                  onClick={() => removeCircle(idx)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                  title="Remove circle item"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600">Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateCircle(idx, { title: e.target.value })}
                    placeholder="Circle item title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">Image</label>
                  {item.image ? (
                    <div className="relative group w-48 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image
                        src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${item.image}`}
                        alt={`Circle ${idx + 1}`}
                        width={0}
                        height={0}
                        sizes="192px"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeCircleImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                        title="Remove image"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        draggingCircle === idx
                          ? "border-navy bg-navy/5"
                          : "border-gray-300 hover:border-navy/40 hover:bg-gray-50"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggingCircle(idx);
                      }}
                      onDragLeave={() => setDraggingCircle(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingCircle(null);
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith("image/")) {
                          handleCircleImageUpload(idx, file);
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
                          if (file) handleCircleImageUpload(idx, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCircle}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-navy/40 hover:text-navy hover:bg-navy/5 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add Circle Item
          </button>
        </div>
      </section>

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
