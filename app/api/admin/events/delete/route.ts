import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const { id, date } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dynamoClient.send(
      new DeleteItemCommand({
        TableName: "ukibc_events",
        Key: { type: { S: "event" }, date: { S: date } },
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: {
          ":id": { S: id },
        },
      }),
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "ukibc-storage",
        Key: `events/${id}`,
      }),
    );

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: "ukibc-optimized",
        Key: `events/${id}.webp`,
      }),
    );

    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete case study", error);
    return NextResponse.json(
      { message: "Failed to delete case study" },
      { status: 500 },
    );
  }
}
