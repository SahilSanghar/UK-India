import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

const dynamoClient = DynamoDBDocumentClient.from(client);

export async function fetchEventById(id: string) {
  try {
    const command = new ScanCommand({
      TableName: "ukibc_events",
      FilterExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    });

    const result = await dynamoClient.send(command);
    const item = result.Items?.[0];

    if (!item) return null;

    return {
      ...item,
      image: item.image
        ? `https://d2paj8ptqa22jg.cloudfront.net${item.image}`
        : "/event.jpg",
    } as any;
  } catch (error) {
    console.error("Failed to fetch event by id", error);
    return null;
  }
}