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

interface LogoItem {
  image: string;
  alt: string;
}

interface LogosData {
  title: string;
  items: LogoItem[];
}

export async function POST(req: Request) {
  try {
    const { type, logos } = (await req.json()) as {
      type: string;
      logos: LogosData;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !logos) {
      return NextResponse.json(
        { message: "type and logos are required" },
        { status: 400 },
      );
    }

    const items = (logos.items || []).map((l) => ({
      M: {
        image: { S: l.image || "" },
        alt: { S: l.alt || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #l = :l",
        ExpressionAttributeNames: {
          "#l": "logos",
        },
        ExpressionAttributeValues: {
          ":l": {
            M: {
              title: { S: logos.title || "" },
              items: { L: items },
            },
          },
        },
      }),
    );

    return NextResponse.json({ message: "Logos updated" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit logos section", error);
    return NextResponse.json(
      { message: "Failed to edit logos section" },
      { status: 500 },
    );
  }
}
