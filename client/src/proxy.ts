import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  // matcher: ["/((?!login|_next/static|_next/image|api).*)"],

  matcher: ["/((?!login|_next/static|api).*)"],

  // matcher: [],
};
