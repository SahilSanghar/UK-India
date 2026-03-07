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

    if (lander.button) {
      const enable =
        lander.button.enable === "on" || lander.button.enable === true;

      await dynamoClient.send(
        new UpdateItemCommand({
          TableName: "ukibc_pages",
          Key: {
            type: { S: type },
          },
          UpdateExpression: "SET #l.#b = :b",
          ExpressionAttributeNames: {
            "#l": "lander",
            "#b": "button",
          },
          ExpressionAttributeValues: {
            ":b": {
              M: {
                enable: { BOOL: enable },
                text: { S: lander.button.text || "" },
                link: { S: lander.button.link || "" },
              },
            },
          },
        }),
      );

      return NextResponse.json({ message: "Button updated" }, { status: 200 });
    }

    if ("flip" in lander) {
      await dynamoClient.send(
        new UpdateItemCommand({
          TableName: "ukibc_pages",
          Key: { type: { S: type } },
          UpdateExpression: "SET #l.#f = :f",
          ExpressionAttributeNames: {
            "#l": "lander",
            "#f": "flip",
          },
          ExpressionAttributeValues: {
            ":f": { BOOL: lander.flip },
          },
        }),
      );

      return NextResponse.json({ message: "Flip updated" }, { status: 200 });
    }

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
