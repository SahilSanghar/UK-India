import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

export async function POST(req: Request) {
  try {
    const { id, date } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate required parameters
    if (!id || typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 },
      );
    }

    if (!date || typeof date !== "string" || date.trim() === "") {
      return NextResponse.json(
        { message: "Invalid date parameter" },
        { status: 400 },
      );
    }

    // Validate ID format (should be a UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id.trim())) {
      return NextResponse.json(
        { message: "Invalid event ID format" },
        { status: 400 },
      );
    }

    const trimmedId = id.trim();

    // Delete from DynamoDB first
    await dynamoClient.send(
      new DeleteItemCommand({
        TableName: "ukibc_events",
        Key: { type: { S: "event" }, date: { S: date } },
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": { S: trimmedId },
        },
      }),
    );

    // Only delete S3 objects if they exist (use try-catch for each to prevent partial failures)
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: "ukibc-storage",
          Key: `events/${trimmedId}`,
        }),
      );
    } catch (s3Error) {
      console.error("Failed to delete image from ukibc-storage:", s3Error);
      // Continue even if S3 delete fails - DynamoDB item is already deleted
    }

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: "ukibc-optimized",
          Key: `events/${trimmedId}.webp`,
        }),
      );
    } catch (s3Error) {
      console.error("Failed to delete optimized image from ukibc-optimized:", s3Error);
      // Continue even if S3 delete fails - DynamoDB item is already deleted
    }

    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete event", error);
    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 },
    );
  }
}
