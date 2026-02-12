// create a signed url for the image upload
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const { key } = await req.json();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log(key);

    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: "ukibc-storage",
        Key: `${key}`,
      }),
      {
        expiresIn: 60 * 60, // 1 hour
      }
    );

    console.log(signedUrl);

    return NextResponse.json({ signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Failed to get signed url", error);
    return NextResponse.json(
      { message: "Failed to get signed url" },
      { status: 500 }
    );
  }
}
