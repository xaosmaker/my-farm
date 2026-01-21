import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function baseRequest({
  url,
  method,
  body = undefined,
}: {
  url: string;
  method: "PATCH" | "POST" | "GET" | "DELETE";
  body?: undefined | BodyInit;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const res = await fetch(url, {
    method: method,
    headers: {
      "content-type": "application/json",
      cookie: session.user.access,
    },
    body: body,
  });
  return res;
}
