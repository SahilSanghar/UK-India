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

    // const limit = Number(searchParams.get("limit")) || 10;
    // const lastKey = searchParams.get("lastKey")
    //   ? JSON.parse(searchParams.get("lastKey")!)
    //   : undefined;
    // const { admin } = await req.json();
    const admin = searchParams.get("admin") === "true";
    // console.log(admin);
    const command = new QueryCommand({
      TableName: "ukibc_members",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": "members",
      },
    });

    // count
    const countCommand = new QueryCommand({
      TableName: "ukibc_members",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": "members",
      },
      Select: "COUNT",
    });

    const result = await dynamoClient.send(command);
    const countResult = await dynamoClient.send(countCommand);

    if (result.Items) {
      result.Items = result.Items.map((item) => {
        return {
          ...item,
          image: item.image
            ? admin
              ? "https://ukibc-storage.s3.ap-south-1.amazonaws.com/members/" +
                item.id
              : "https://d2paj8ptqa22jg.cloudfront.net/members/" +
                item.id +
                ".webp"
            : "/default.png",
        };
      });
    }

    return NextResponse.json(
      {
        members: result.Items ?? [],
        // lastKey: result.LastEvaluatedKey ?? null,
        count: countResult.Count ?? 0,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get members",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
