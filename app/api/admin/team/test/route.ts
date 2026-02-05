import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export async function POST() {
  try {
    const scan = await dynamoClient.send(
      new ScanCommand({
        TableName: "ukibc_team",
        ProjectionExpression: "id, #d, #s",
        ExpressionAttributeNames: {
          "#d": "date",
          "#s": "sort",
        },
      })
    );

    if (!scan.Items || scan.Items.length === 0) {
      return NextResponse.json({ message: "No items found" });
    }

    // Keep only items that HAVE numeric sort
    const items = scan.Items
      .map((item) => ({
        id: item.id.S!,
        date: Number(item.date.N!),
        sort: item.sort?.N ? Number(item.sort.N) : null,
      }))
      .filter((item) => item.sort !== null)
      .sort((a, b) => (a.sort! - b.sort!));

    // Assign new lexicographic keys
    for (let i = 0; i < items.length; i++) {
      const sortKey = toBase62(i * 1000).padStart(4, "0");

      await dynamoClient.send(
        new UpdateItemCommand({
          TableName: "ukibc_team",
          Key: {
            id: { S: items[i].id },
            date: { N: String(items[i].date) },
          },
          UpdateExpression: "SET sortKey = :k",
          ExpressionAttributeValues: {
            ":k": { S: sortKey },
          },
        })
      );
    }

    return NextResponse.json({
      message: "sortKey migration complete",
      count: items.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Migration failed" },
      { status: 500 }
    );
  }
}

// ---------- utils ----------

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase62(num: number) {
  if (num === 0) return CHARS[0];
  let result = "";
  while (num > 0) {
    result = CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}
