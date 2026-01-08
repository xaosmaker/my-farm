import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";

export async function getSettings() {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/settings`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return undefined;
}
