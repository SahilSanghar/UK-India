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

interface CompanyItem {
  title: string;
  link: string;
  image: string;
}

export async function POST(req: Request) {
  try {
    const { type, company } = (await req.json()) as {
      type: string;
      company: CompanyItem[];
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !company) {
      return NextResponse.json(
        { message: "type and company are required" },
        { status: 400 },
      );
    }

    const items = (company || []).map((c) => ({
      M: {
        title: { S: c.title || "" },
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
          "#c": "company",
        },
        ExpressionAttributeValues: {
          ":c": { L: items },
        },
      }),
    );

    return NextResponse.json(
      { message: "Companies updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit companies", error);
    return NextResponse.json(
      { message: "Failed to edit companies" },
      { status: 500 },
    );
  }
}
