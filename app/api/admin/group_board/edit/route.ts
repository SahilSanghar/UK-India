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
    const { id, title, job_title, content, date, address } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_group-board",
        Key: {
          type: { S: "group-board" },
          date: { S: date },
        },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET #t = :t, #j = :j, #c = :c, #a = :a",
        ExpressionAttributeNames: {
          "#t": "title",
          "#j": "job_title",
          "#c": "content",
          "#a": "address",
        },
        ExpressionAttributeValues: {
          ":id": { S: String(id) },
          ":t": { S: String(title || "") },
          ":j": { S: String(job_title || "") },
          ":c": { S: String(content || "") },
          ":a": { S: String(address || "") },
        },
      })
    );

    return NextResponse.json(
      { message: "Group board member edited" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to edit group board member", error);
    return NextResponse.json(
      { message: "Failed to edit group board member" },
      { status: 500 }
    );
  }
}
