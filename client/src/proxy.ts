// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const intlMiddleware = createMiddleware(routing);
  const res = intlMiddleware(req);
  return res;
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
