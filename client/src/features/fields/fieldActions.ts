"use server";

import { redirect } from "next/navigation";
import { baseFetch } from "@/lib/baseFetch";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";
import { Field } from "./fieldTypes";
import { FieldSchema } from "./fieldSchema";
import { revalidatePath } from "next/cache";

export async function createFieldAction(
  _previousState: unknown,
  formData: FieldSchema,
) {
  const d = {
    name: formData.name,
    epsg2100Boundary: null,
    epsg4326Boundary: null,
    mapLocation: null,
    fieldLocation: formData.fieldLocation,
    areaInMeters: parseFloat(formData.areaInMeters),
    isOwned: formData.isOwned,
  };

  const res = await baseFetch({
    path: `/api/fields`,
    method: "POST",
    body: d,
  });

  if (res.ok) {
    return redirect("/fields");
  }

  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}

export async function updateFieldAction(
  oldData: Field,
  _previousState: unknown | undefined,
  formData: FieldSchema,
) {
  const d: {
    [k: string]: string | number | boolean;
  } = {};
  if (oldData) {
    for (const key in formData) {
      const k = key as keyof Field;
      const s = key as keyof FieldSchema;

      if (s === "govPDF" || oldData[k]?.toString() === formData[s].toString()) {
        continue;
      }
      if (s === "areaInMeters") {
        d[key] = parseFloat(formData[s]);
      } else {
        d[key] = formData[s];
      }
    }
  }

  if (Object.keys(d).length > 0) {
    const res = await baseFetch({
      path: `/api/fields/${oldData?.id}`,
      method: "PATCH",
      body: d,
    });

    if (res.ok) {
      return redirect(`/fields/${oldData?.id}`);
    }

    const t = await getTranslations("Global.Error");
    const data = await res.json();
    return { success: false, errors: serverErrorDTO(data, t) };
  }
  return undefined;
}

export async function deleteFieldAction(_prevState: unknown, fieldId: string) {
  console.log(fieldId, "delete action");
  const res = await baseFetch({
    path: `/api/fields/${fieldId}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    revalidatePath("/api/field:");
    return { success: true, errors: undefined };
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
