"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getSession(){ 
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value || "";
  if(!token) return null;

  try{ 
    const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return payload;
  }
  catch {
    return null;
  }
}

export async function deleteSession(){ 
  const cookieStore = await cookies();
  cookieStore.delete("session");
}