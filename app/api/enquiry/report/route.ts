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
    const {
      reportId,
      reportName,
      name,
      organization,
      phone,
      email,
      message,
    } = await req.json();

    if (!reportId || !reportName || !name || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();

    const command = new PutItemCommand({
      TableName: "ukibc_enquiry",
      Item: {
        type: { S: "report" },
        id: { S: id },
        reportId: { S: reportId },
        reportName: { S: reportName },
        name: { S: name },
        organization: { S: organization ?? "" },
        phone: { S: phone ?? "" },
        email: { S: email },
        message: { S: message ?? "" },
        date: { S: new Date().toISOString() },
      },
    });
    await dynamoClient.send(command);
    return NextResponse.json(
      { message: "Report enquiry created" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to create report enquiry", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
