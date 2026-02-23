"use server";

import { redirect } from "next/navigation";
import { baseFetch } from "@/lib/baseFetch";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";
import { SuppliesSchema } from "./suppliesSchema";
import { revalidatePath } from "next/cache";
import { Supply } from "@/types/globalTypes";

export async function createSupplyAction(
  _previousState: unknown,
  formData: SuppliesSchema,
) {
  const d = {
    nickname: formData.nickname || null,
    name: formData.name,
    supplyType: formData.supplyType,
    measurementUnit: formData.measurementUnit,
  };

  const res = await baseFetch({
    path: `/api/supplies`,
    method: "POST",
    body: d,
  });

  if (res.ok) {
    return redirect("/supplies");
  }

  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}

export async function updateSupplyAction(
  oldData: Supply,
  _previousState: unknown | undefined,
  formData: SuppliesSchema,
) {
  const d: {
    [k: string]: string | null;
  } = {};
  if (oldData) {
    for (const key in formData) {
      const k = key as keyof Supply;
      const s = key as keyof SuppliesSchema;

      if (oldData[k]?.toString() === formData[s].toString()) {
        continue;
      }
      if (s === "nickname" && formData[s] === "") {
        d[key] = null;
      } else {
        d[key] = formData[s];
      }
    }
  }

  if (Object.keys(d).length > 0) {
    const res = await baseFetch({
      path: `/api/supplies/${oldData?.id}`,
      method: "PATCH",
      body: d,
    });

    if (res.ok) {
      return redirect(`/supplies/${oldData?.id}`);
    }

    const t = await getTranslations("Global.Error");
    const data = await res.json();
    return { success: false, errors: serverErrorDTO(data, t) };
  }
  return undefined;
}

export async function deleteSupplyAction(
  _prevState: unknown,
  supplyId: string,
) {
  const res = await baseFetch({
    path: `/api/supplies/${supplyId}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    revalidatePath("/supplies");
    return { success: true, errors: undefined };
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
