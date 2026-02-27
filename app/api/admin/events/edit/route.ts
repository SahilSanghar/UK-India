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
    } = await req.json();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: "ukibc_events",
        Key: {
          type: { S: "event" },
          date: { S: date },
        },
        ConditionExpression: "id = :id",
        UpdateExpression:
          "SET #t = :t, #c = :c, #i = :i, #s = :s, #e = :e, #tm = :tm, #l = :l, #v = :v, #w = :w",
        ExpressionAttributeNames: {
          "#t": "title",
          "#c": "content",
          "#i": "image",
          "#s": "start_date",
          "#e": "end_date",
          "#tm": "time",
          "#l": "location",
          "#v": "venue",
          "#w": "who_can_attend",
        },
        ExpressionAttributeValues: {
          ":id": { S: id },
          ":t": { S: title || "" },
          ":c": { S: content || "" },
          ":i": { S: image ? `/events/${id}` : "" },
          ":s": { S: start_date?.replace(/-/g, "") || "" },
          ":e": { S: end_date?.replace(/-/g, "") || "" },
          ":tm": { S: time || "" },
          ":l": { S: location || "" },
          ":v": { S: venue || "" },
          ":w": { S: who_can_attend || "" },
        },
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
