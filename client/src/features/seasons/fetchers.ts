import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { Season } from "@/types/sharedTypes";
import { SeasonStatistics } from "./types/seasonTypes";

export async function getAllSeasons(fieldId: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/seasons/${fieldId}`,
    method: "GET",
    body: undefined,
  });
  const data: Season[] = await res.json();
  return data;
}

export async function getSeasonStatistics(seasonId: string | number) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/seasons/statistics/${seasonId}`,
    method: "GET",
    body: undefined,
  });
  const data: SeasonStatistics[] = await res.json();
  return data;
}

export async function getAllActiveSeasons() {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/seasons`,
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
