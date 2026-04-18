import { NextResponse } from "next/server";
import slugify from "slugify";
import { getSession } from "@/lib/session";
import { AttributeValue, DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const { title, image, job_title, content, date, sort, address, filters } = await req.json();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const filtersArray = filters || [];
    const filtersList = filtersArray.map((f: string) => ({ S: f }));

    const id = crypto.randomUUID();
    const item: Record<string, AttributeValue> = {
      id: { S: id },
      type: { S: "team" },
      date: { S: date },
      sort: { S: sort },
      title: { S: title },
      image: { S: `https://ukibc.s3.ap-south-1.amazonaws.com/team/${id}`},
      job_title: { S: job_title },
      content: { S: content },
      address: { S: address },
      slug: { S: slugify(title, { lower: true, strict: true }) },
    };

    // Add filters if provided
    if (filtersList.length > 0) {
      item.filters = { L: filtersList };
    }

    await dynamoClient.send(
      new PutItemCommand({
        TableName: "ukibc_team",
        Item: item,
      })
    );

    let signedUrl = null;
    if (image) {
      signedUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: "ukibc-storage",
          Key: `team/${id}`,
        }),
        { expiresIn: 60 * 60 }
      );
    }

    return NextResponse.json(
      { message: "Team member created", id, signedUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to create team member", error);
    return NextResponse.json(
      { message: "Failed to create team member" },
      { status: 500 }
    );
  }
}
