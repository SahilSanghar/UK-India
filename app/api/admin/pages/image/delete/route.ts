import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const { key } = await req.json();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { message: "Invalid image key" },
        { status: 400 },
      );
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "ukibc-storage",
        Key: key,
      }),
    );
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "ukibc-optimized",
        Key: `${key}.webp`,
      }),
    );


    return NextResponse.json({ message: "Image deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete image from S3", error);
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 },
    );
  }
}
