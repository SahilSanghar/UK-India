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

interface WhoCard {
  title: string;
  image: string;
}

interface WhoPayload {
  title: string;
  cards: WhoCard[];
}

export async function POST(req: Request) {
  try {
    const { type, who } = (await req.json()) as {
      type: string;
      who: WhoPayload;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !who) {
      return NextResponse.json(
        { message: "type and who are required" },
        { status: 400 },
      );
    }

    const cards = (who.cards || []).map((card) => ({
      M: {
        title: { S: card.title || "" },
        image: { S: card.image || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #w = :w",
        ExpressionAttributeNames: {
          "#w": "who",
        },
        ExpressionAttributeValues: {
          ":w": {
            M: {
              title: { S: who.title || "" },
              cards: { L: cards },
            },
          },
        },
      }),
    );

    return NextResponse.json({ message: "Who section updated" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit who section", error);
    return NextResponse.json(
      { message: "Failed to edit who section" },
      { status: 500 },
    );
  }
}
