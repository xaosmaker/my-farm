import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const res = handleI18nRouting(req);

  return res;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
