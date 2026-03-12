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

interface FullscreenCardItem {
  title: string;
  image: string;
  buttonTxt: string;
  link: string;
}

interface FullscreenData {
  title: string;
  des: string;
  cards: FullscreenCardItem[];
}

export async function POST(req: Request) {
  try {
    const { type, fullscreen, fieldKey = "fullscreen" } = (await req.json()) as {
      type: string;
      fullscreen: FullscreenData;
      fieldKey?: string;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedFields = ["fullscreen", "fullscreen2", "fullscreen3", "fullscreen4"];
    if (!allowedFields.includes(fieldKey)) {
      return NextResponse.json(
        { message: "Invalid field key" },
        { status: 400 },
      );
    }

    if (!type || !fullscreen) {
      return NextResponse.json(
        { message: "type and fullscreen are required" },
        { status: 400 },
      );
    }

    const cardItems = (fullscreen.cards || []).map((c) => ({
      M: {
        title: { S: c.title || "" },
        image: { S: c.image || "" },
        buttonTxt: { S: c.buttonTxt || "" },
        link: { S: c.link || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #f = :f",
        ExpressionAttributeNames: {
          "#f": fieldKey,
        },
        ExpressionAttributeValues: {
          ":f": {
            M: {
              title: { S: fullscreen.title || "" },
              des: { S: fullscreen.des || "" },
              cards: { L: cardItems },
            },
          },
        },
      }),
    );

    return NextResponse.json(
      { message: "Fullscreen section updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit fullscreen section", error);
    return NextResponse.json(
      { message: "Failed to edit fullscreen section" },
      { status: 500 },
    );
  }
}
