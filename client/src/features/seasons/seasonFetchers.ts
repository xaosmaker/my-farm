import { baseFetch } from "@/lib/baseFetch";
import { getTranslations } from "next-intl/server";
import { MUnit } from "@/types/genetalTypes";
import { Season } from "@/types/globalTypes";
import { serverErrorDTO } from "@/lib/serverErrorDTO";

export async function getSeasons(translate: boolean = true) {
  const res = await baseFetch({
    path: "/api/seasons",
    method: "GET",
    body: undefined,
  });
  const data: Season[] = await res.json();
  if (translate) {
    const t = await getTranslations("Units");

    data.map((d) => {
      d.landUnit = t(d.landUnit as MUnit);
      return d;
    });
  }
  return data;
}

export async function getSeason(seasonId: string) {
  const res = await baseFetch({
    path: `/api/seasons/${seasonId}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const t = await getTranslations("Units");
    const data: Season = await res.json();
    data.landUnit = t(data.landUnit as MUnit);
    return data;
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
