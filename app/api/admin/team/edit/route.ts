import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});
export async function POST(req: Request) {
  try {
    const { id, title, job_title, content, date } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_team",
        Key: {
          type: { S: "team" },
          date: { S: date },
        },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET #t = :t, #j = :j, #c = :c",
        ExpressionAttributeNames: {
          "#t": "title",
          "#j": "job_title",
          "#c": "content",
        },
        ExpressionAttributeValues: {
          ":id": { S: id },
          ":t": { S: title },
          ":j": { S: job_title },
          ":c": { S: content },
        },
      })
    );

    return NextResponse.json(
      { message: "Team member edited" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to edit team member", error);
    return NextResponse.json(
      { message: "Failed to edit team member" },
      { status: 500 }
    );
  }
}
