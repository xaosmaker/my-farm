import { baseFetch } from "@/lib/baseFetch";
import { getLocale, getTranslations } from "next-intl/server";
import { MUnit, Season } from "@/types/globalTypes";

export async function getSeasonsByFieldId(
  fieldId: string,
  timezone: string,
  translate: boolean = true,
) {
  const res = await baseFetch({
    path: `/api/seasons/${fieldId}`,
    method: "GET",
    body: undefined,
  });
  const data: Season[] = await res.json();
  if (translate) {
    const t = await getTranslations("Units");
    const locale = await getLocale();

    data.map((d) => {
      d.landUnit = t(d.landUnit as MUnit);
      d.startSeason = new Date(d.startSeason).toLocaleDateString(locale, {
        timeZone: timezone,
      });

      if (d.finishSeason) {
        d.finishSeason = new Date(d.finishSeason).toLocaleDateString(locale, {
          timeZone: timezone,
        });
      }
      return d;
    });
  }
  return data;
}

export async function getSeasons(timezone: string, translate: boolean = true) {
  const res = await baseFetch({
    path: "/api/seasons",
    method: "GET",
    body: undefined,
  });
  const data: Season[] = await res.json();
  if (translate) {
    const t = await getTranslations("Units");
    const locale = await getLocale();

    data.map((d) => {
      d.landUnit = t(d.landUnit as MUnit);
      d.startSeason = new Date(d.startSeason).toLocaleDateString(locale, {
        timeZone: timezone,
      });

      if (d.finishSeason) {
        d.finishSeason = new Date(d.finishSeason).toLocaleDateString(locale, {
          timeZone: timezone,
        });
      }
      return d;
    });
  }
  return data;
}

export async function getSeason(
  seasonId: string,
  timezone: string,
  translate: boolean = true,
) {
  const res = await baseFetch({
    path: `/api/seasons/${seasonId}/details`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const locale = await getLocale();
    const t = await getTranslations("Units");
    const data: Season = await res.json();
    if (translate) {
      data.landUnit = t(data.landUnit as MUnit);
      data.startSeason = new Date(data.startSeason).toLocaleDateString(locale, {
        timeZone: timezone,
      });
      if (data.finishSeason) {
        data.finishSeason = new Date(data.finishSeason).toLocaleDateString(
          locale,
          {
            timeZone: timezone,
          },
        );
      }
    }

    return data;
  }
  const t = await getTranslations("Global.Error");
  throw new Error(t("not_found_error", { name: "supply" }));
}
