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

interface TestimonialItem {
  quote: string;
  des: string;
  name: string;
  role: string;
  image: string;
  link: string;
}

export async function POST(req: Request) {
  try {
    const { type, testimonials, fieldKey = "testimonials" } = (await req.json()) as {
      type: string;
      testimonials: TestimonialItem[];
      fieldKey?: string;
    };

    const allowedFields = ["testimonials", "testimonials2", "testimonials3", "testimonials4"];
    if (!allowedFields.includes(fieldKey)) {
      return NextResponse.json(
        { message: "Invalid field key" },
        { status: 400 },
      );
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !testimonials) {
      return NextResponse.json(
        { message: "type and testimonials are required" },
        { status: 400 },
      );
    }

    const items = (testimonials || []).map((t) => ({
      M: {
        quote: { S: t.quote || "" },
        des: { S: t.des || "" },
        name: { S: t.name || "" },
        role: { S: t.role || "" },
        image: { S: t.image || "" },
        link: { S: t.link || "" },
      },
    }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #t = :t",
        ExpressionAttributeNames: {
          "#t": fieldKey,
        },
        ExpressionAttributeValues: {
          ":t": { L: items },
        },
      }),
    );

    return NextResponse.json(
      { message: "Testimonials updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit testimonials", error);
    return NextResponse.json(
      { message: "Failed to edit testimonials" },
      { status: 500 },
    );
  }
}
