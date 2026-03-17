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
    const {
      id,
      title,
      content,
      date,
      image,
      start_date,
      end_date,
      time,
      location,
      venue,
      who_can_attend,
      tempdate,
    } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let updateExpression =
      "SET #t = :t, #c = :c, #s = :s, #e = :e, #tm = :tm, #l = :l, #v = :v, #w = :w, #td = :td";
    const exprNames: Record<string, string> = {
      "#t": "title",
      "#c": "content",
      "#s": "start_date",
      "#e": "end_date",
      "#tm": "time",
      "#l": "location",
      "#v": "venue",
      "#w": "who_can_attend",
      "#td": "tempdate",
    };
    const exprValues: Record<string, { S: string }> = {
      ":id": { S: id },
      ":t": { S: title || "" },
      ":c": { S: content || "" },
      ":s": { S: start_date?.replace(/-/g, "") || "" },
      ":e": { S: end_date?.replace(/-/g, "") || "" },
      ":tm": { S: time || "" },
      ":l": { S: location || "" },
      ":v": { S: venue || "" },
      ":w": { S: who_can_attend || "" },
      ":td": { S: tempdate || "" },
    };

    if (image) {
      updateExpression += ", #i = :i";
      exprNames["#i"] = "image";
      exprValues[":i"] = { S: `/events/${id}` };
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_events",
        Key: {
          type: { S: "event" },
          date: { S: date },
        },
        ConditionExpression: "id = :id",
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: exprNames,
        ExpressionAttributeValues: exprValues,
      }),
    );

    return NextResponse.json({ message: "Event edited" }, { status: 200 });
  } catch (error) {
    console.error("Failed to edit event", error);
    return NextResponse.json(
      { message: "Failed to edit event" },
      { status: 500 },
    );
  }
}
