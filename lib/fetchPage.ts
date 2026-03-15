import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function fetchPage(type: string) {
  try {
    // Get all pages (using Scan to retrieve all items from 'ukibc_pages')
    const command = new QueryCommand({
      TableName: "ukibc_pages",
      KeyConditionExpression: "#t = :t",
      ExpressionAttributeNames: {
        "#t": "type",
      },
      ExpressionAttributeValues: {
        ":t": { S: type },
      },
    });

    const result = await dynamoClient.send(command);
    const marshalled = result.Items?.map((item) => unmarshall(item));

    // console.log(marshalled?.[0]);

    return marshalled?.[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}
