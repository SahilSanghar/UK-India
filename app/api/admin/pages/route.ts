import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
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
    // Get all pages (using Scan to retrieve all items from 'ukibc_pages')
    const command = new ScanCommand({
      TableName: "ukibc_pages",
    });

    const result = await dynamoClient.send(command);
    const pages = result.Items?.map((item) => unmarshall(item)) ?? [];

    return NextResponse.json({ pages: pages ?? [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get pages" }, { status: 500 });
  }
}
