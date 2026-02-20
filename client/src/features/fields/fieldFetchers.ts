import { baseFetch } from "@/lib/baseFetch";
import { Field } from "./fieldTypes";
import { getTranslations } from "next-intl/server";
import { MUnit } from "@/types/genetalTypes";

export async function getFields(translate: boolean = true) {
  const res = await baseFetch({
    path: "/api/fields",
    method: "GET",
    body: undefined,
  });
  const data: Field[] = await res.json();
  if (translate) {
    const t = await getTranslations("Units");

    data.map((d) => {
      d.isOwned = t(`${d.isOwned}` as MUnit);
      d.landUnit = t(d.landUnit as MUnit);
      return d;
    });
  }
  return data;
}

export async function getField(fieldId: string) {
  const res = await baseFetch({
    path: `/api/fields/${fieldId}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data: Field = await res.json();
    return data;
  }
  const t = await getTranslations("Global.Error");
  throw new Error(t("not_found_error", { name: "" }));
}
