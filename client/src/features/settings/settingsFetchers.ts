import { baseFetch } from "@/lib/baseFetch";
import { UserSettings } from "@/types/globalTypes";

export async function getSettings() {
  const res = await baseFetch({
    path: "/api/settings",
    method: "GET",
    body: undefined,
  });
  const data = await res.json();

  return data;
}

export async function updateSettings(data: Pick<UserSettings, "landUnit">) {
  const res = await baseFetch({
    path: "/api/settings",
    method: "POST",
    body: data,
  });
  return res;
}
