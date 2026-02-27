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
    const { title, image, content, date, sort, filters, url } = await req.json();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const filtersArray = filters || [];
    const filtersList = filtersArray.map((f: string) => ({ S: f }));

    const id = crypto.randomUUID();
    const item: Record<string, AttributeValue> = {
      id: { S: id },
      type: { S: "members" },
      date: { S: date },
      sort: { S: sort },
      filters: { L: filtersList },
      title: { S: title },
      image: { S: `/members/${id}`},
      url: { S: url },
      content: { S: content },
      slug: { S: slugify(title, { lower: true }) },
    };

    await dynamoClient.send(
      new PutItemCommand({
        TableName: "ukibc_members",
        Item: item,
      })
    );

    let signedUrl = null;
    if (image) {
      signedUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: "ukibc-storage",
          Key: `members/${id}`,
        }),
        { expiresIn: 60 * 60 }
      );
    }

    return NextResponse.json(
      { message: "Member created", id, signedUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to create member", error);
    return NextResponse.json(
      { message: "Failed to create member" },
      { status: 500 }
    );
  }
}
