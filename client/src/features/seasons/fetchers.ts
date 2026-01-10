import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { Season } from "./types/seasonTypes";

export async function getAllSeasons(fieldId: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/seasons/${fieldId}`,
    method: "GET",
    body: undefined,
  });
  const data: Season[] = await res.json();
  data.map((item) => {
    item.startSeason = new Date(item.startSeason).toLocaleDateString();
    if (item.finishSeason) {
      item.finishSeason = new Date(item.finishSeason).toLocaleDateString();
    }
    item.createdAt = new Date(item.createdAt).toLocaleDateString();
    item.updatedAt = new Date(item.updatedAt).toLocaleDateString();
    return item;
  });
  return data;
}
