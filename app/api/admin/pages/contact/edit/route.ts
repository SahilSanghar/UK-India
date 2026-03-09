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

interface ContactPayload {
  title: string;
  content: string;
  image: string;
}

export async function POST(req: Request) {
  try {
    const { type, contact } = (await req.json()) as {
      type: string;
      contact: ContactPayload;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !contact) {
      return NextResponse.json(
        { message: "type and contact are required" },
        { status: 400 },
      );
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #c = :c",
        ExpressionAttributeNames: {
          "#c": "contact",
        },
        ExpressionAttributeValues: {
          ":c": {
            M: {
              title: { S: contact.title || "" },
              content: { S: contact.content || "" },
              image: { S: contact.image || "" },
            },
          },
        },
      }),
    );

    return NextResponse.json(
      { message: "Contact section updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit contact section", error);
    return NextResponse.json(
      { message: "Failed to edit contact section" },
      { status: 500 },
    );
  }
}
