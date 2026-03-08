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

interface StatCard {
  title: string;
  valueBefore: string;
  valueAfter: string;
  number: number;
  des: string;
  disclaimer: string;
  link: string;
}

interface StatsPayload {
  title: string;
  cards: StatCard[];
}

export async function POST(req: Request) {
  try {
    const { type, stats } = (await req.json()) as {
      type: string;
      stats: StatsPayload;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !stats) {
      return NextResponse.json(
        { message: "type and stats are required" },
        { status: 400 },
      );
    }

    const cards = (stats.cards || []).map((card) => ({
      M: {
        title: { S: card.title || "" },
        valueBefore: { S: card.valueBefore || "" },
        valueAfter: { S: card.valueAfter || "" },
        number: { N: String(card.number || 0) },
        des: { S: card.des || "" },
        disclaimer: { S: card.disclaimer || "" },
        link: { S: card.link || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #s = :s",
        ExpressionAttributeNames: {
          "#s": "stats",
        },
        ExpressionAttributeValues: {
          ":s": {
            M: {
              title: { S: stats.title || "" },
              cards: { L: cards },
            },
          },
        },
      }),
    );

    return NextResponse.json({ message: "Stats updated" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit stats", error);
    return NextResponse.json(
      { message: "Failed to edit stats" },
      { status: 500 },
    );
  }
}
