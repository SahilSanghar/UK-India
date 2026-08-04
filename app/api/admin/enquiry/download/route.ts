import { NextResponse, NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

async function fetchAllEnquiries(type: string) {
  const items: Record<string, unknown>[] = [];
  let lastKey: Record<string, unknown> | undefined;

  do {
    const command = new QueryCommand({
      TableName: "ukibc_enquiry",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: { "#t": "type" },
      ExpressionAttributeValues: { ":t": type },
      ExclusiveStartKey: lastKey,
      ScanIndexForward: false,
    });

    const result = await dynamoClient.send(command);
    items.push(...(result.Items ?? []));
    lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastKey);

  return items;
}

async function resolveUser(userId: string) {
  const result = await dynamoClient.send(
    new ScanCommand({
      TableName: "ukibc_users",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: { ":id": userId },
    }),
  );
  if (result.Items && result.Items.length > 0) {
    const { password, ...safeUser } = result.Items[0];
    return safeUser;
  }
  return null;
}

async function resolveReport(reportId: string) {
  const result = await dynamoClient.send(
    new ScanCommand({
      TableName: "ukibc_reports",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: { ":id": reportId },
    }),
  );
  return result.Items?.[0] ?? null;
}

function formatDate(dateStr: unknown): string {
  if (!dateStr) return "";
  const d = new Date(dateStr as string);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "contact";

    const items = await fetchAllEnquiries(type);

    if (type === "contact") {
      const rows = items.map((item: Record<string, unknown>) => ({
        Date: formatDate(item.date),
        Email: (item.email as string) || "",
        Name: [item.firstname, item.lastname].filter(Boolean).join(" "),
        Organization: (item.organization as string) || "",
        Location: (item.location as string) || "",
        Assistance: (item.assistance as string) || "",
        Message: (item.message as string) || "",
      }));

      return NextResponse.json({ rows }, { status: 200 });
    }

    // For reports, resolve user and report details. Older entries only have
    // a userId pointing at a ukibc_users account (from the removed
    // signup/login flow); newer entries carry the submitter's details
    // directly on the enquiry item since there's no account anymore.
    const rows = await Promise.all(
      items.map(async (item: Record<string, unknown>) => {
        const [user, report] = await Promise.all([
          item.userId ? resolveUser(item.userId as string) : null,
          item.reportId ? resolveReport(item.reportId as string) : null,
        ]);

        const firstname = (user?.firstname ?? item.firstname) as string | undefined;
        const lastname = (user?.lastname ?? item.lastname) as string | undefined;
        const email = (user?.email ?? item.email) as string | undefined;
        const organization = (user?.organization ?? item.organization) as string | undefined;
        const phone = (user?.phone ?? item.phone) as string | undefined;
        const userMessage = (user?.message ?? item.message) as string | undefined;

        return {
          Date: formatDate(item.date),
          "User Email": email || "",
          "User Name": [firstname, lastname].filter(Boolean).join(" "),
          "User Organization": organization || "",
          "User Phone": phone || "",
          "User Message": userMessage || "",
          "Report Title": (report?.title as string) || (item.reportName as string) || "",
          "Report Link": report?.slug ? `https://www.ukibc.com/reports/${report.slug}` : "",
        };
      }),
    );

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to export enquiries",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
