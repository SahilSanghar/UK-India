import { NextResponse, NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

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
    const userId = searchParams.get("userId");
    const reportId = searchParams.get("reportId");

    let user = null;
    let report = null;

    if (userId) {
      const userResult = await dynamoClient.send(
        new ScanCommand({
          TableName: "ukibc_users",
          FilterExpression: "id = :id",
          ExpressionAttributeValues: { ":id": userId },
        }),
      );
      if (userResult.Items && userResult.Items.length > 0) {
        const { password, ...safeUser } = userResult.Items[0];
        user = safeUser;
      }
    }

    if (reportId) {
      const reportResult = await dynamoClient.send(
        new ScanCommand({
          TableName: "ukibc_reports",
          FilterExpression: "id = :id",
          ExpressionAttributeValues: { ":id": reportId },
        }),
      );
      if (reportResult.Items && reportResult.Items.length > 0) {
        report = reportResult.Items[0];
      }
    }

    return NextResponse.json({ user, report }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get details",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
