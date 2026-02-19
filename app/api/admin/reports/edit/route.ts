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
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      content,
      // new payload (preferred)
      oldDate,
      newDate,
      // legacy payload (back-compat)
      date,
      image,
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
      typeof oldDateKey !== "string" ||
      !newDateKey ||
      typeof newDateKey !== "string"
    ) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const nextSlug = slugify(title, { lower: true });

    // If the date key changes, we must "move" the item (create new + delete old).
    if (newDateKey !== oldDateKey) {
      const existing = await dynamoClient.send(
        new GetItemCommand({
          TableName: "ukibc_reports",
          Key: { type: { S: "report" }, date: { S: oldDateKey } },
        }),
      );

      if (!existing.Item) {
        return NextResponse.json(
          { message: "Report not found" },
          { status: 404 },
        );
      }

      const oldItem = unmarshall(existing.Item) as Record<string, unknown>;
      const previousImageValue = oldItem.image;
      const updatedImageValue =
        image === true
          ? `https://ukibc-storage.s3.ap-south-1.amazonaws.com/reports/${id}`
          : typeof previousImageValue === "string"
            ? previousImageValue
            : "";

      await dynamoClient.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              Put: {
                TableName: "ukibc_reports",
                Item: {
                  id: { S: id },
                  type: { S: "report" },
                  date: { S: newDateKey },
                  title: { S: title },
                  content: { S: content },
                  slug: { S: nextSlug },
                  image: { S: updatedImageValue },
                },
                ConditionExpression: "attribute_not_exists(#t) AND attribute_not_exists(#d)",
                ExpressionAttributeNames: {
                  "#t": "type",
                  "#d": "date",
                },
              },
            },
            {
              Delete: {
                TableName: "ukibc_reports",
                Key: { type: { S: "report" }, date: { S: oldDateKey } },
                ConditionExpression: "id = :id",
                ExpressionAttributeValues: {
                  ":id": { S: id },
                },
              },
            },
          ],
        }),
      );

      return NextResponse.json({ message: "Report moved" }, { status: 200 });
    }

    // Otherwise, update in place.
    const updateExpressionParts = ["#t = :t", "#c = :c", "#s = :s"];
    const expressionAttributeNames: Record<string, string> = {
      "#t": "title",
      "#c": "content",
      "#s": "slug",
    };
    const expressionAttributeValues: Record<string, { S: string }> = {
      ":id": { S: id },
      ":t": { S: title },
      ":c": { S: content },
      ":s": { S: nextSlug },
    };

    if (image === true) {
      updateExpressionParts.push("#i = :i");
      expressionAttributeNames["#i"] = "image";
      expressionAttributeValues[":i"] = {
        S: `https://ukibc-storage.s3.ap-south-1.amazonaws.com/reports/${id}`,
      };
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_reports",
        Key: { type: { S: "report" }, date: { S: oldDateKey } },
        ConditionExpression: "id = :id",
        UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    );

    return NextResponse.json({ message: "Report edited" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit case study", error);
    return NextResponse.json(
      { message: "Failed to edit case study" },
      { status: 500 },
    );
  }
}
