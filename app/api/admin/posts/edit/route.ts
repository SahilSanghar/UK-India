import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import slugify from "slugify";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});
export async function POST(req: Request) {
  try {
    const { id, title, content, date } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_posts",
        Key: {
          type: { S: "post" },
          date: { S: date },
        },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET #t = :t, #c = :c, #s = :s",
        ExpressionAttributeNames: {
          "#t": "title",
          "#c": "content",
          "#s": "slug",
        },
        ExpressionAttributeValues: {
          ":id": { S: id },
          ":t": { S: title },
          ":c": { S: content },
          ":s": { S: slugify(title, { lower: true }) + "-" + id.slice(0, 8) },
        },
      }),
    );

    return NextResponse.json({ message: "Post edited" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit post", error);
    return NextResponse.json(
      { message: "Failed to edit post" },
      { status: 500 },
    );
  }
}
