"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface MembershipData {
  buttonTxt: string;
  des: string;
  image: string;
  link: string;
  title: string;
  title2: string;
}

interface MembershipProps {
  type: string;
  rawMembership: Record<string, unknown>;
}

export default function Membership({ type, rawMembership }: MembershipProps) {
  const queryClient = useQueryClient();

  const [membership, setMembership] = useState<MembershipData>({
    buttonTxt: "",
    des: "",
    image: "",
    link: "",
    title: "",
    title2: "",
  });
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!rawMembership) return;
    setMembership({
      buttonTxt: (rawMembership.buttonTxt as string) || "",
      des: (rawMembership.des as string) || "",
      image: (rawMembership.image as string) || "",
      link: (rawMembership.link as string) || "",
      title: (rawMembership.title as string) || "",
      title2: (rawMembership.title2 as string) || "",
    });
  }, [rawMembership]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/membership/edit", {
        type,
        membership,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save membership section", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const oldImage = membership.image;
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

      setMembership((prev) => ({ ...prev, image: uuid }));
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const removeImage = async () => {
    const imageKey = membership.image;
    if (!imageKey) return;
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
    } catch {
      // image may already be deleted
    }
    setMembership((prev) => ({ ...prev, image: "" }));
  };

  const update = (partial: Partial<MembershipData>) =>
    setMembership((prev) => ({ ...prev, ...partial }));

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Membership Details</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Title</label>
              <input
                type="text"
                value={membership.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Main title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Title 2</label>
              <input
                type="text"
                value={membership.title2}
                onChange={(e) => update({ title2: e.target.value })}
                placeholder="Secondary title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Description</label>
            <textarea
              value={membership.des}
              onChange={(e) => update({ des: e.target.value })}
              placeholder="Membership description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Button Text</label>
              <input
                type="text"
                value={membership.buttonTxt}
                onChange={(e) => update({ buttonTxt: e.target.value })}
                placeholder="e.g. Join Now"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Link</label>
              <input
                type="text"
                value={membership.link}
                onChange={(e) => update({ link: e.target.value })}
                placeholder="/page-link or https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Image</label>
            {membership.image ? (
              <div className="relative group w-48 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${membership.image}`}
                  alt="Membership"
                  width={0}
                  height={0}
                  sizes="192px"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                  title="Remove image"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  dragging
                    ? "border-navy bg-navy/5"
                    : "border-gray-300 hover:border-navy/40 hover:bg-gray-50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    handleImageUpload(file);
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
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
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
