import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

// We excluded 0-9 to avoid the leading-zero length trap
const BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateKeyBetween(left: string | null, right: string | null): string {
  // 1. Initial State: If the list is empty
  if (!left && !right) return "V";

  const l = left || "";
  const r = right || "{"; // '{' sorts after 'z'

  let result = "";
  let i = 0;

  while (true) {
    const charL = l[i] || "A"; // Use 'A' as the floor
    const charR = r[i] || "{"; // Use '{' as the ceiling

    const idxL = BASE.indexOf(charL);
    const idxR = BASE.indexOf(charR) === -1 ? BASE.length : BASE.indexOf(charR);

    if (idxR - idxL > 1) {
      // Found a gap! Pick the middle character
      const mid = Math.floor((idxL + idxR) / 2);
      result += BASE[mid];
      break;
    } else {
      // No gap here, move to the next character position
      result += charL;
      i++;

      // If we've exhausted the right string, we append a midpoint
      if (i >= r.length && !l[i]) {
        result += "V";
        break;
      }
    }
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, date, left, right } = await req.json();

    if (!id || !date) {
      return NextResponse.json(
        { message: "id and date are required" },
        { status: 400 }
      );
    }

    const newSortKey = generateKeyBetween(left ?? null, right ?? null);
    console.log(newSortKey);

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_members",
        Key: {
          type: { S: "members" }, // ✅ PK
          date: { S: String(date) }, // ✅ SK
        },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET sort = :s",
        ExpressionAttributeValues: {
          ":id": { S: String(id) },
          ":s": { S: newSortKey },
        },
      })
    );

    return NextResponse.json(
      { message: "Member sorted", sortKey: newSortKey },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update member sort" },
      { status: 500 }
    );
  }
}
