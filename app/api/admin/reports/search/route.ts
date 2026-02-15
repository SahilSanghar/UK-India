// search reports by title or description

import { NextResponse, NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

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
    const search = searchParams.get("search");
    if (!search) {
      return NextResponse.json(
        { message: "Search is required" },
        { status: 400 },
      );
    }

    // To ensure at least the correct partition type, we'll add a filter for type = "report" to only search reports, assuming the table has a "type" attribute.
    // Use a filter expression that performs case-insensitive search by using lower() on attribute
    // DynamoDB does not support lower(), so we must search in a case-sensitive manner.
    // To get around this, you could either store lower-cased versions of the text in dedicated attributes at write time and search those,
    // or fetch all reports and filter in JS. Here, we'll search as-is (case-sensitive), with a warning comment.

    const command = new ScanCommand({
      TableName: "ukibc_reports",
      FilterExpression:
        "(contains(slug, :search) OR contains(description, :search)) AND #type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":search": search.toLowerCase(),
        ":type": "report",
      },
    });

    const result = await dynamoClient.send(command);
    console.log(result);
    return NextResponse.json(result.Items ?? [], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to search reports",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
