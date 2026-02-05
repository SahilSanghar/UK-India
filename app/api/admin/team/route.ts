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

export async function GET() {
  try {
    // const { searchParams } = new URL(req.url);

    // const limit = Number(searchParams.get("limit")) || 10;
    // const lastKey = searchParams.get("lastKey")
    //   ? JSON.parse(searchParams.get("lastKey")!)
    //   : undefined;

    const command = new QueryCommand({
      TableName: "ukibc_team",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": "team",
      },
    });

    // count
    const countCommand = new QueryCommand({
      TableName: "ukibc_team",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": "team",
      },
      Select: "COUNT",
    });

    const result = await dynamoClient.send(command);
    const countResult = await dynamoClient.send(countCommand);

    return NextResponse.json(
      {
        team: result.Items ?? [],
        // lastKey: result.LastEvaluatedKey ?? null,
        count: countResult.Count ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get team members",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
