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

interface LocationItem {
  src: string;
  title: string;
  phone: string;
  email: string;
  address: string;
}

export async function POST(req: Request) {
  try {
    const { type, locations } = (await req.json()) as {
      type: string;
      locations: LocationItem[];
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !locations) {
      return NextResponse.json(
        { message: "type and locations are required" },
        { status: 400 },
      );
    }

    const items = (locations || []).map((l) => ({
      M: {
        src: { S: l.src || "" },
        title: { S: l.title || "" },
        phone: { S: l.phone || "" },
        email: { S: l.email || "" },
        address: { S: l.address || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #l = :l",
        ExpressionAttributeNames: {
          "#l": "locations",
        },
        ExpressionAttributeValues: {
          ":l": { L: items },
        },
      }),
    );

    return NextResponse.json(
      { message: "Locations section updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit locations section", error);
    return NextResponse.json(
      { message: "Failed to edit locations section" },
      { status: 500 },
    );
  }
}
