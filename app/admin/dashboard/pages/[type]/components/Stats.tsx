"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface StatCard {
  title: string;
  valueBefore: string;
  valueAfter: string;
  number: number;
  des: string;
  disclaimer: string;
  link: string;
}

interface StatsData {
  title: string;
  cards: StatCard[];
}

interface StatsProps {
  type: string;
  rawStats: Record<string, unknown>;
}

export default function Stats({ type, rawStats }: StatsProps) {
  const queryClient = useQueryClient();

  const [stats, setStats] = useState<StatsData>({ title: "", cards: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!rawStats) return;
    const rawCards = Array.isArray(rawStats.cards)
      ? (rawStats.cards as Record<string, unknown>[])
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
