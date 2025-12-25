import { auth } from "./auth";

export async function baseRequest({
  url,
  method,
  body = undefined,
}: {
  url: string;
  method: "PATCH" | "POST" | "GET";
  body?: undefined | BodyInit;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Log in to continue");
  }
  return fetch(url, {
    method: method,
    headers: {
      "content-type": "application/json",
      cookie: session.user.access,
    },
    body: body,
  });
}
