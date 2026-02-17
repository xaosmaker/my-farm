import { getAuth } from "./getAuth";
import { SERVER_URL } from "./serverUrl";

type allowedMethods = "PATCH" | "PUT" | "POST" | "GET" | "DELETE";

export async function baseFetch({
  path,
  method,
  body,
}: {
  path: string;
  method: allowedMethods;
  body: { [key: string]: string } | undefined;
}) {
  const session = await getAuth();
  return fetch(`${SERVER_URL}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      cookie: session.user!.access,
    },
    body: JSON.stringify(body),
  });
}
