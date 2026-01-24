import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;
  const session = await getSession();

  if (!session && pathname.startsWith("/admin/dashboard")){
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (session && pathname == "/admin"){
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin","/admin/dashboard/:path*"],
}