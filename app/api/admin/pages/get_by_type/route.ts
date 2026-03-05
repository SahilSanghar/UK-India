import { NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    // Get all pages (using Scan to retrieve all items from 'ukibc_pages')
    const command = new QueryCommand({
      TableName: "ukibc_pages",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": { S: type },
      },
    });

    const result = await dynamoClient.send(command);
    const marshalled = result.Items?.map((item) => unmarshall(item));

    console.log(marshalled?.[0]);

    return NextResponse.json({ page: marshalled?.[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get pages" }, { status: 500 });
  }
}
