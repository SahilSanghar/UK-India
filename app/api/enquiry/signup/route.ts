import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

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
      firstname,
      lastname,
      email,
      password,
      organization,
      phone,
      message,
    } = await req.json();

    if (!firstname || !email || !password || !organization || !phone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingUser = await dynamoClient.send(
      new ScanCommand({
        TableName: "ukibc_users",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email },
      }),
    );

    if (existingUser.Items && existingUser.Items.length > 0) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const id = crypto.randomUUID();

    const command = new PutItemCommand({
      TableName: "ukibc_users",
      Item: {
        id: { S: id },
        type: { S: "user" },
        firstname: { S: firstname },
        lastname: { S: lastname },
        email: { S: email },
        password: { S: await bcrypt.hash(password, 10) },
        organization: { S: organization },
        phone: { S: phone ?? null },
        message: { S: message ?? null },
        date: { S: new Date().toISOString() },
      },
    });
    await dynamoClient.send(command);

    const token = await new SignJWT({
      id: id,
      type: "user",
      firstname: firstname,
      lastname: lastname,
      organization: organization,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      // path: "/"  // Optionally set path if needed
    });

    return NextResponse.json(
      { message: "Sign up successful" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to sign up", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
