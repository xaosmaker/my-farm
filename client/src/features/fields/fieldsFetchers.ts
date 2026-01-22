import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { Field } from "@/types/sharedTypes";
import { getTranslations } from "next-intl/server";

export async function getAllFields() {
  const t = await getTranslations("LandUnit");
  const res = await baseRequest({
    url: `${SERVER_URL}/api/fields`,
    method: "GET",
    body: undefined,
  });

  if (res.ok) {
    const data: Field[] = await res.json();
    for (const d of data) {
      d.landUnit = t(d.landUnit);
    }

    return data;
  }
  return [];
}

export async function getFieldById(id: string): Promise<Field | undefined> {
  const t = await getTranslations("LandUnit");
  const res = await baseRequest({
    url: `${SERVER_URL}/api/fields/${id}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data = await res.json();
    data.landUnit = t(data.landUnit);
    return data;
  }
  return undefined;
}
