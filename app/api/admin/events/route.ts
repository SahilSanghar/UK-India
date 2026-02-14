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

    const limit = Number(searchParams.get("limit")) || 10;
    const lastKey = searchParams.get("lastKey")
      ? JSON.parse(searchParams.get("lastKey")!)
      : undefined;

    const command = new QueryCommand({
      TableName: "ukibc_events",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": "event",
      },
      Limit: limit || 10,
      ExclusiveStartKey: lastKey || undefined,
      ScanIndexForward: false, // newest first
    });

    // count
    const countCommand = new QueryCommand({
      TableName: "ukibc_events",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": "event",
      },
      Select: "COUNT",
    });

    const result = await dynamoClient.send(command);
    // Change every image field in the result.Items
    if (result.Items) {
      result.Items = result.Items.map((item) => {
        return {
          ...item,
          image: item.image
            ? "https://ukibc-storage.s3.ap-south-1.amazonaws.com" + item.image
            : "/default.png",
        };
      });
    }

    const countResult = await dynamoClient.send(countCommand);

    return NextResponse.json(
      {
        events: result.Items ?? [],
        lastKey: result.LastEvaluatedKey ?? null,
        count: countResult.Count ?? 0,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get events",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
