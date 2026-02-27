import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

const PDF_URL_PREFIX =
  "https://ukibc-storage.s3.ap-south-1.amazonaws.com/reports/pdfs/";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const id = formData.get("id") as string | null;
    const date = formData.get("date") as string | null;

    if (!file || !id?.trim() || !date?.trim()) {
      return NextResponse.json(
        { message: "Missing file, id, or date" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "File must be a PDF" },
        { status: 400 }
      );
    }

    const key = `reports/pdfs/${id.trim()}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3Client.send(
      new PutObjectCommand({
        Bucket: "ukibc-storage",
        Key: key,
        Body: buffer,
        ContentType: "application/pdf",
      })
    );

    const pdfUrl = `${PDF_URL_PREFIX}${id.trim()}.pdf`;

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_reports",
        Key: { type: { S: "report" }, date: { S: date.trim() } },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET #d = :d, #p = :p",
        ExpressionAttributeNames: {
          "#d": "download",
          "#p": "pdfUrl",
        },
        ExpressionAttributeValues: {
          ":id": { S: id.trim() },
          ":d": { BOOL: true },
          ":p": { S: pdfUrl },
        },
      })
    );

    return NextResponse.json(
      { message: "PDF uploaded", pdfUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to upload report PDF", error);
    return NextResponse.json(
      { message: "Failed to upload report PDF" },
      { status: 500 }
    );
  }
}
