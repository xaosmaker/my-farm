import { auth } from "@/lib/auth";
import { SERVER_URL } from "@/lib/serverUrl";

export async function getAllFields() {
  const session = await auth();
  if (!session?.user) {
    return [];
  }
  const res = await fetch(`${SERVER_URL}/api/fields`, {
    method: "GET",

    headers: {
      "content-type": "application/json",
      cookie: session.user.access,
    },
  });
  console.log(res);

  if (res.ok) {
    return res.json();
  }
  return [];
}
