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

export async function POST(req: Request) {
  try {
    const { type, lander } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!type) {
      return NextResponse.json(
        { message: "type, id, and lander are required" },
        { status: 400 },
      );
    }

    console.log(lander);

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_pages",
        Key: {
          type: { S: type },
        },
        UpdateExpression: "SET #l = :l",
        ExpressionAttributeNames: {
          "#l": "lander",
        },
        ExpressionAttributeValues: {
          ":l": {
            M: {
              title: { L: lander.title.map((t: string) => ({ S: t })) },
              des: { L: lander.des.map((d: string) => ({ S: d })) },
              image: { L: lander.image.map((i: string) => ({ S: i })) },
            },
          },
        },
      }),
    );

    return NextResponse.json({ message: "Page updated" }, { status: 200 });
  } catch (error) {
    // console.log(error.message);
    // console.error("Failed to edit page", error);
    return NextResponse.json(
      { message: "Failed to edit page" },
      { status: 500 },
    );
  }
}
