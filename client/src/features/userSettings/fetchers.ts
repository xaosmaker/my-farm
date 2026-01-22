import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { UserSettings } from "@/types/sharedTypes";
import { getTranslations } from "next-intl/server";

export async function getSettings(translate: boolean = false) {
  const t = await getTranslations("LandUnit");
  const res = await baseRequest({
    url: `${SERVER_URL}/api/settings`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: UserSettings = await res.json();
    if (translate) {
      data.landUnit = t(data.landUnit);
    }
    return data;
  }
  throw new Error("Cant find settings");
}
