import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { Supply } from "@/types/sharedTypes";
import { getTranslations } from "next-intl/server";

export async function getAllSupplies(translate: boolean = false) {
  const t = await getTranslations("Supplies.Response");
  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Supply[] = await res.json();
    if (translate) {
      data.map((item) => {
        item.supplyType = t(item.supplyType);
        item.measurementUnit = t(item.measurementUnit);
        return item;
      });
    }
    return data;
  }
  return [];
}

export async function getSupplyById(id: string, translate: boolean = false) {
  const t = await getTranslations("Supplies.Response");
  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies/${id}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Supply[] = await res.json();
    if (translate) {
      data.map((item) => {
        item.supplyType = t(item.supplyType);
        item.measurementUnit = t(item.measurementUnit);
        return item;
      });
    }
    return data;
  }
  return [];
}
