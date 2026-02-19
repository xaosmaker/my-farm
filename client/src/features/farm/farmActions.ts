"use server";

import { baseFetch } from "@/lib/baseFetch";
import { CreateFarmSchema } from "./farmSchemas";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";

export async function createFarmAction(
  _prevState: unknown,
  farmData: CreateFarmSchema,
) {
  const res = await baseFetch({
    path: "/api/farms",
    method: "POST",
    body: farmData,
  });
  if (res.status === 201) {
    return { success: true, errors: undefined };
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
