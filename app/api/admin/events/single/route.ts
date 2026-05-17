import { NextResponse, NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }

    const command = new ScanCommand({
      TableName: "ukibc_events",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    });

    const result = await dynamoClient.send(command);
    const item = result.Items?.[0];

    if (!item) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...item,
      image: item.image
        ? `https://d2paj8ptqa22jg.cloudfront.net/events/${item.id}.webp`
        : "/event.jpg",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}