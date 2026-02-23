import { baseFetch } from "@/lib/baseFetch";
import { getTranslations } from "next-intl/server";
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

export async function getSupply(supplyId: string, translate: boolean = true) {
  const res = await baseFetch({
    path: `/api/supplies/${supplyId}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Supply = await res.json();

    if (translate) {
      const t = await getTranslations("SupplyTypes");
      const ut = await getTranslations("Units");
      data.supplyType = t(data.supplyType as MSupplyType);
      data.measurementUnit = ut(data.measurementUnit as MUnit);
    }
    return data;
  }
  const t = await getTranslations("Global.Error");
  throw new Error(t("not_found_error", { name: "supply" }));
}
