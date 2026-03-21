import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function POST(req: Request) {
  try {
    const { firstname, lastname, organization, email, location, assistance, message } =
      await req.json();

    if (!firstname || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();

    const command = new PutItemCommand({
      TableName: "ukibc_enquiry",
      Item: {
        type: { S: "contact" },
        id: { S: id },
        firstname: { S: firstname },
        lastname: { S: lastname },
        organization: { S: organization ?? "" },
        email: { S: email },
        location: { S: location ?? "" },
        assistance: { S: assistance ?? "none" },
        message: { S: message ?? "" },
        date: { S: new Date().toISOString() },
      },
    });

    await dynamoClient.send(command);

    return NextResponse.json(
      { message: "Contact enquiry submitted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to create contact enquiry", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
