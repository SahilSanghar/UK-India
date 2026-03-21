"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";

interface ImageCropModalProps {
  imageSrc: string;
  aspect?: number;
  onCropDone: (croppedFile: File) => void;
  onCancel: () => void;
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<File> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageSrc;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to crop image"));
          return;
        }
        resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  });
}

export default function ImageCropModal({
  imageSrc,
  aspect = 1,
  onCropDone,
  onCancel,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedFile);
    } catch {
      console.error("Failed to crop image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-[90vw] max-w-lg overflow-hidden">
        <div className="relative w-full h-[60vh]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex flex-col gap-3 px-6 py-4">
          <label className="flex items-center gap-3 text-sm font-medium text-navy">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-navy"
            />
          </label>

          <div className="flex flex-row gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-full border border-navy text-navy hover:bg-navy/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleConfirm()}
              disabled={saving}
              className="px-6 py-2 rounded-full bg-navy text-white hover:bg-navy/90 transition-colors cursor-pointer"
            >
              {saving ? "Cropping..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
