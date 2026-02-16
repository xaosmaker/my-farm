import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const handleI18nRouting = createMiddleware(routing);
export async function proxy(req: NextRequest) {
  // const session = await auth();
  console.log(req.url, 123, req.redirect, 4);

  // if (!session?.user) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
  const res = handleI18nRouting(req);

  return res;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  // matcher: ["/((?!login|_next/static|api|register|verify).*)"],
};

// import { auth } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";
//
// export default async function proxy(req: NextRequest) {
//   const session = await auth();
//
//   if (!session?.user) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }
// import { auth } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";
//
// export default async function proxy(req: NextRequest) {
//   const session = await auth();
//
//   if (!session?.user) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }
//
// export const config = {
//   // matcher: ["/((?!login|_next/static|_next/image|api).*)"],
//
//   matcher: ["/((?!login|_next/static|api|register|verify).*)"],
//
//   // matcher: [],
// };
