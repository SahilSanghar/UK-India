import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

interface MembershipPayload {
  buttonTxt: string;
  des: string;
  image: string;
  link: string;
  title: string;
  title2: string;
}

export async function POST(req: Request) {
  try {
    const { type, membership } = (await req.json()) as {
      type: string;
      membership: MembershipPayload;
    };

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type || !membership) {
      return NextResponse.json(
        { message: "type and membership are required" },
        { status: 400 },
      );
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: { type: { S: type } },
        UpdateExpression: "SET #m = :m",
        ExpressionAttributeNames: {
          "#m": "membership",
        },
        ExpressionAttributeValues: {
          ":m": {
            M: {
              buttonTxt: { S: membership.buttonTxt || "" },
              des: { S: membership.des || "" },
              image: { S: membership.image || "" },
              link: { S: membership.link || "" },
              title: { S: membership.title || "" },
              title2: { S: membership.title2 || "" },
            },
          },
        },
      }),
    );

    return NextResponse.json(
      { message: "Membership section updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to edit membership section", error);
    return NextResponse.json(
      { message: "Failed to edit membership section" },
      { status: 500 },
    );
  }
}
