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
export async function POST(req: Request) {
  try {
    const { id, title, content, date, image } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_projects",
        Key: {
          type: { S: "case-study" },
          date: { S: date },
        },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET #t = :t, #c = :c, #i = :i",
        ExpressionAttributeNames: {
          "#t": "title",
          "#c": "content",
          "#i": "image",
        },
        ExpressionAttributeValues: {
          ":id": { S: id },
          ":t": { S: title },
          ":c": { S: content },
          ":i": { S: image ? `https://ukibc-storage.s3.ap-south-1.amazonaws.com/projects/${id}` : "" },
        },
      }),
    );

    return NextResponse.json({ message: "Case study edited" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit case study", error);
    return NextResponse.json(
      { message: "Failed to edit case study" },
      { status: 500 },
    );
  }
}
