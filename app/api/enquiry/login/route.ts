import { NextResponse, NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const expiresIn = "30d";

const dynamoClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.A_CLIENT!,
    secretAccessKey: process.env.A_SECRET!,
  },
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const password = searchParams.get("password");

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 },
      );
    }

    const command = new ScanCommand({
      TableName: "ukibc_users",
      FilterExpression: "username = :identifier OR email = :identifier",
      ExpressionAttributeValues: {
        ":identifier": username,
      },
    });

    const user = await dynamoClient.send(command);

    if (!user.Items || user.Items.length === 0) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 },
      );
    }

    const truePassword = await bcrypt.compare(password, user.Items[0].password);

    if (!truePassword) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 },
      );
    }

    const token = await new SignJWT({
      username: user.Items[0].username,
      firstname: user.Items[0].firstname,
      lastname: user.Items[0].lastname,
      organization:
        user.Items[0].organization ||
        user.Items[0].firstname + " " + user.Items[0].lastname,
      id: user.Items[0].id,
      admin: user.Items[0].type === "admin" ? true : false,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(expiresIn)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      // path: "/"  // Optionally set path if needed
    });

    return NextResponse.json({ message: "Login successful!" }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      {
        message: "Unexpected error",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
