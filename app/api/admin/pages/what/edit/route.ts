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

interface WhatCard {
  title: string;
  des: string;
  link: string;
  images: string[];
}

interface WhatPayload {
  title: string;
  des: string;
  cards: WhatCard[];
}

export async function POST(req: Request) {
  try {
    const { type, what } = (await req.json()) as {
      type: string;
      what: WhatPayload;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !what) {
      return NextResponse.json(
        { message: "type and what are required" },
        { status: 400 },
      );
    }

    const cards = (what.cards || []).map((card) => ({
      M: {
        title: { S: card.title || "" },
        des: { S: card.des || "" },
        link: { S: card.link || "" },
        images: {
          L: (card.images || []).map((img: string) => ({ S: img })),
        },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #w = :w",
        ExpressionAttributeNames: {
          "#w": "what",
        },
        ExpressionAttributeValues: {
          ":w": {
            M: {
              title: { S: what.title || "" },
              des: { S: what.des || "" },
              cards: { L: cards },
            },
          },
        },
      }),
    );

    return NextResponse.json({ message: "What section updated" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit what section", error);
    return NextResponse.json(
      { message: "Failed to edit what section" },
      { status: 500 },
    );
  }
}
