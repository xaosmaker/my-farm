import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { Season } from "@/types/sharedTypes";

export async function getAllSeasons(fieldId: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/seasons/${fieldId}`,
    method: "GET",
    body: undefined,
  });
  const data: Season[] = await res.json();
  return data;
}

export async function getSeasonById(fieldId: string, seasonId: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/seasons/${fieldId}/${seasonId}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Season = await res.json();
    return data;
  }
}
