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

interface BoxItem {
  buttonTxt: string;
  content: string;
  image: string[];
  link: string;
  title: string;
}

export async function POST(req: Request) {
  try {
    const { type, box } = (await req.json()) as {
      type: string;
      box: BoxItem[];
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !box) {
      return NextResponse.json(
        { message: "type and box are required" },
        { status: 400 },
      );
    }

    const items = (box || []).map((b) => ({
      M: {
        buttonTxt: { S: b.buttonTxt || "" },
        content: { S: b.content || "" },
        image: { L: (b.image || []).map((i) => ({ S: i })) },
        link: { S: b.link || "" },
        title: { S: b.title || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #b = :b",
        ExpressionAttributeNames: {
          "#b": "box",
        },
        ExpressionAttributeValues: {
          ":b": { L: items },
        },
      }),
    );

    return NextResponse.json(
      { message: "Box section updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit box section", error);
    return NextResponse.json(
      { message: "Failed to edit box section" },
      { status: 500 },
    );
  }
}
