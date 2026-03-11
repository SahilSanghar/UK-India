"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, Trash2Icon } from "lucide-react";
import TextEditor from "@/components/TextEditor";

interface LocationItem {
  src: string;
  title: string;
  phone: string;
  email: string;
  address: string;
}

interface LocationsProps {
  type: string;
  rawLocations: Record<string, unknown>[];
}

export default function Locations({ type, rawLocations }: LocationsProps) {
  const queryClient = useQueryClient();

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!rawLocations) return;
    const items = Array.isArray(rawLocations) ? rawLocations : [];
    setLocations(
      items.map((l) => ({
        src: (l.src as string) || "",
        title: (l.title as string) || "",
        phone: (l.phone as string) || "",
        email: (l.email as string) || "",
        address: (l.address as string) || "",
      })),
    );
  }, [rawLocations]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/locations/edit", {
        type,
        locations,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save locations section", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const updateLocation = (index: number, partial: Partial<LocationItem>) => {
    setLocations((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...partial } : l)),
    );
  };

  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      { src: "", title: "", phone: "", email: "", address: "" },
    ]);
  };

  const removeLocation = (index: number) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      {locations.map((loc, idx) => (
        <section
          key={idx}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">
              Location {idx + 1}
              {loc.title
                ? ` — ${loc.title.slice(0, 40)}${loc.title.length > 40 ? "..." : ""}`
                : ""}
            </h2>
            <button
              type="button"
              onClick={() => removeLocation(idx)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition cursor-pointer"
              title="Remove location"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Title</label>
              <input
                type="text"
                value={loc.title}
                onChange={(e) => updateLocation(idx, { title: e.target.value })}
                placeholder="Location title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">
                Source / Embed URL
              </label>
              <input
                type="text"
                value={loc.src}
                onChange={(e) => updateLocation(idx, { src: e.target.value })}
                placeholder="e.g. Google Maps embed URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="text"
                  value={loc.phone}
                  onChange={(e) =>
                    updateLocation(idx, { phone: e.target.value })
                  }
                  placeholder="+44 ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="text"
                  value={loc.email}
                  onChange={(e) =>
                    updateLocation(idx, { email: e.target.value })
                  }
                  placeholder="info@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <TextEditor
                content={loc.address || ""}
                onChange={(address) => updateLocation(idx, { address })}
              />
            </div>
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addLocation}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-navy/40 hover:bg-gray-50 text-gray-500 hover:text-navy text-sm font-medium px-5 py-3 rounded-xl transition cursor-pointer"
        >
          <PlusIcon className="w-4 h-4" />
          Add Location
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
