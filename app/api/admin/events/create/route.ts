import { NextResponse } from "next/server";
import slugify from "slugify";
import { getSession } from "@/lib/session";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_CLIENT!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const {
      title,
      image,
      content,
      date,
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

    const id = crypto.randomUUID();
    await dynamoClient.send(
      new PutItemCommand({
        TableName: "ukibc_events",
        Item: {
          id: { S: id },
          type: { S: "event" },
          date: { S: date },
          start_date: { S: start_date.replace(/-/g, "") },
          end_date: { S: end_date.replace(/-/g, "") },
          time: { S: time },
          location: { S: location },
          venue: { S: venue },
          who_can_attend: { S: who_can_attend },
          title: { S: title },
          image: {
            S: `/events/${id}`,
          },
          content: { S: content },
          slug: { S: slugify(title, { lower: true }) + "-" + id.slice(0, 8) },
        },
      }),
    );

    let signedUrl = null;
    if (image) {
      signedUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: "ukibc-storage",
          Key: `events/${id}`,
        }),
        { expiresIn: 60 * 60 },
      );
    }

    return NextResponse.json(
      { message: "Event created", id, signedUrl },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to create event", error);
    return NextResponse.json(
      { message: "Failed to create event" },
      { status: 500 },
    );
  }
}
