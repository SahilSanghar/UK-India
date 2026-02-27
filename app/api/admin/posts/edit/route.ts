import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import slugify from "slugify";
import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      content,
      oldDate,
      newDate,
      // back-compat: previous payload only had { id, title, content, date }
      date,
    } = body ?? {};

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const oldDateKey = (oldDate ?? date) as string | undefined;
    const newDateKey = newDate as string | undefined;

    if (
      !id ||
      typeof id !== "string" ||
      !title ||
      typeof title !== "string" ||
      typeof content !== "string" ||
      !oldDateKey ||
      typeof oldDateKey !== "string"
    ) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const nextSlug = slugify(title, { lower: true }) + "-" + id.slice(0, 8);

    // If the date key changed, move the item to the new key.
    if (newDateKey && newDateKey !== oldDateKey) {
      const existing = await dynamoClient.send(
        new GetItemCommand({
          TableName: "ukibc_posts",
          Key: { type: { S: "post" }, date: { S: oldDateKey } },
        }),
      );

      if (!existing.Item) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 },
        );
      }

      const oldItem = unmarshall(existing.Item) as Record<string, unknown>;
      const previousImageValue = oldItem.image;
      const updatedImageValue =
        typeof previousImageValue === "string" ? previousImageValue : "";

      await dynamoClient.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              Put: {
                TableName: "ukibc_posts",
                Item: {
                  id: { S: id },
                  type: { S: "post" },
                  date: { S: newDateKey },
                  title: { S: title },
                  content: { S: content },
                  slug: { S: nextSlug },
                  image: { S: updatedImageValue },
                },
                ConditionExpression:
                  "attribute_not_exists(#t) AND attribute_not_exists(#d)",
                ExpressionAttributeNames: {
                  "#t": "type",
                  "#d": "date",
                },
              },
            },
            {
              Delete: {
                TableName: "ukibc_posts",
                Key: { type: { S: "post" }, date: { S: oldDateKey } },
                ConditionExpression: "id = :id",
                ExpressionAttributeValues: {
                  ":id": { S: id },
                },
              },
            },
          ],
        }),
      );

      return NextResponse.json({ message: "Post moved" }, { status: 200 });
    }

    // Otherwise, update in place.
    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_posts",
        Key: {
          type: { S: "post" },
          date: { S: oldDateKey },
        },
        ConditionExpression: "id = :id",
        UpdateExpression: "SET #t = :t, #c = :c, #s = :s",
        ExpressionAttributeNames: {
          "#t": "title",
          "#c": "content",
          "#s": "slug",
        },
        ExpressionAttributeValues: {
          ":id": { S: id },
          ":t": { S: title },
          ":c": { S: content },
          ":s": { S: nextSlug },
        },
      }),
    );

    return NextResponse.json({ message: "Post edited" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit post", error);
    return NextResponse.json(
      { message: "Failed to edit post" },
      { status: 500 },
    );
  }
}
