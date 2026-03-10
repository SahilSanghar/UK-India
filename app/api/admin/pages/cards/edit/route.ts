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

interface CardItem {
  title: string;
  des: string;
  link: string;
  image: string;
}

export async function POST(req: Request) {
  try {
    const { type, cards } = (await req.json()) as {
      type: string;
      cards: CardItem[];
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !cards) {
      return NextResponse.json(
        { message: "type and cards are required" },
        { status: 400 },
      );
    }

    const items = (cards || []).map((c) => ({
      M: {
        title: { S: c.title || "" },
        des: { S: c.des || "" },
        link: { S: c.link || "" },
        image: { S: c.image || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #c = :c",
        ExpressionAttributeNames: {
          "#c": "cards",
        },
        ExpressionAttributeValues: {
          ":c": { L: items },
        },
      }),
    );

    return NextResponse.json(
      { message: "Cards section updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit cards section", error);
    return NextResponse.json(
      { message: "Failed to edit cards section" },
      { status: 500 },
    );
  }
}
