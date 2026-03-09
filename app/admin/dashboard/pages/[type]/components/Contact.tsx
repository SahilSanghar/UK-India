"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "@/components/TextEditor";

interface ContactData {
  title: string;
  content: string;
  image: string;
}

interface ContactProps {
  type: string;
  rawContact: Record<string, unknown>;
}

export default function Contact({ type, rawContact }: ContactProps) {
  const queryClient = useQueryClient();

  const [contact, setContact] = useState<ContactData>({
    title: "",
    content: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!rawContact) return;
    setContact({
      title: (rawContact.title as string) || "",
      content: (rawContact.content as string) || "",
      image: (rawContact.image as string) || "",
    });
  }, [rawContact]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-pages", type] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/pages/contact/edit", {
        type,
        contact,
      });
      if (res.status !== 200) throw new Error("Failed to save");
      invalidate();
    } catch (error) {
      console.error("Failed to save contact section", error);
      alert("Failed to save: " + error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const oldImage = contact.image;
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

      setContact((prev) => ({ ...prev, image: uuid }));
    } catch (error) {
      alert("Failed to upload image: " + error);
    }
  };

  const removeImage = async () => {
    const imageKey = contact.image;
    if (!imageKey) return;
    try {
      await axios.post("/api/admin/pages/image/delete", {
        key: `pages/${type}/${imageKey}`,
      });
    } catch {
      // image may already be deleted
    }
    setContact((prev) => ({ ...prev, image: "" }));
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-5">
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-navy">Contact Details</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Title</label>
            <input
              type="text"
              value={contact.title}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Contact section title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Content</label>
            <TextEditor
              content={contact.content || ""}
              onChange={(content) =>
                setContact((prev) => ({ ...prev, content }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">Image</label>
            {contact.image ? (
              <div className="relative group w-48 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={`https://ukibc-storage.s3.ap-south-1.amazonaws.com/pages/${type}/${contact.image}`}
                  alt="Contact"
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
