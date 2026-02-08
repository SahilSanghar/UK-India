// get post by slug
import { NextResponse, NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const command = new QueryCommand({
      TableName: "ukibc_posts",
      KeyConditionExpression: "#t = :t AND #s = :s",
      ExpressionAttributeNames: {
        "#t": "type",

        "#s": "slug",
      },
      ExpressionAttributeValues: {
        ":t": { S: "post" },
        ":s": { S: slug },
      },
    });

    const result = await dynamoClient.send(command);

    return NextResponse.json(result.Items?.[0] ?? null, { status: 200 });
  } catch (error) {
    console.error("Failed to get post", error);
    return NextResponse.json({ error: "Failed to get post" }, { status: 500 });
  }
}
