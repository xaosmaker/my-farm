import { baseFetch } from "@/lib/baseFetch";
import { getLocale, getTranslations } from "next-intl/server";
import { MSupplyType, MUnit, Supply } from "@/types/globalTypes";

export async function getSupplies(translate: boolean = true) {
  const res = await baseFetch({
    path: "/api/supplies",
    method: "GET",
    body: undefined,
  });
  const data: Supply[] = await res.json();
  if (translate) {
    const t = await getTranslations("SupplyTypes");
    const ut = await getTranslations("Units");

    data.map((d) => {
      d.supplyType = t(d.supplyType as MSupplyType);
      d.measurementUnit = ut(d.measurementUnit as MUnit);
      return d;
    });
  }
  return data;
}

export async function getSupply(
  supplyId: string,
  translate: boolean = false,
  timezone: string = "",
) {
  const res = await baseFetch({
    path: `/api/supplies/${supplyId}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Supply = await res.json();

    if (translate) {
      if (timezone === "") {
        throw new Error("intl should be passed for translation");
      }
      const t = await getTranslations("SupplyTypes");
      const ut = await getTranslations("Units");
      const locale = await getLocale();
      data.supplyType = t(data.supplyType as MSupplyType);
      data.measurementUnit = ut(data.measurementUnit as MUnit);
      data.createdAt = new Date(data.createdAt).toLocaleDateString(locale, {
        timeZone: timezone,
      });

      data.updatedAt = new Date(data.updatedAt).toLocaleDateString(locale, {
        timeZone: timezone,
      });
    }
    return data;
  }
  const t = await getTranslations("Global.Error");
  throw new Error(t("not_found_error", { name: "supply" }));
}
