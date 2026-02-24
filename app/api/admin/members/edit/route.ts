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
    const { id, title, content, date, filters, url } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const filtersArray = filters || [];
    const filtersList = filtersArray.map((f: string) => ({ S: f }));

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_members",
        Key: {
          type: { S: "members" },
          date: { S: date },
        },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET #t = :t, #u = :u, #c = :c, #f = :f",
        ExpressionAttributeNames: {
          "#t": "title",
          "#u": "url",
          "#c": "content",
          "#f": "filters",
        },
        ExpressionAttributeValues: {
          ":id": { S: id },
          ":t": { S: title },
          ":u": { S: url },
          ":c": { S: content },
          ":f": { L: filtersList },
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
