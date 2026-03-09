import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

interface SectorItem {
  title: string;
  image: string;
}

export async function POST(req: Request) {
  try {
    const { type, sectors } = (await req.json()) as {
      type: string;
      sectors: SectorItem[];
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !sectors) {
      return NextResponse.json(
        { message: "type and sectors are required" },
        { status: 400 },
      );
    }

    const items = (sectors || []).map((s) => ({
      M: {
        title: { S: s.title || "" },
        image: { S: s.image || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #s = :s",
        ExpressionAttributeNames: {
          "#s": "sectors",
        },
        ExpressionAttributeValues: {
          ":s": { L: items },
        },
      }),
    );

    return NextResponse.json(
      { message: "Sectors updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit sectors", error);
    return NextResponse.json(
      { message: "Failed to edit sectors" },
      { status: 500 },
    );
  }
}
