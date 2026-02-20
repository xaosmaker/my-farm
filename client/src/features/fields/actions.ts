"use server";

import { FieldFormData } from "@/features/fields/fieldValidators";
import { redirect } from "next/navigation";
import { baseFetch } from "@/lib/baseFetch";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";
import { Field } from "./fieldTypes";

export async function createFieldAction(
  _previousState: unknown,
  formData: FieldFormData,
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
  formData: FieldFormData,
) {
  const d: {
    [k: string]: string | number | boolean;
  } = {};
  if (oldData) {
    for (const key in formData) {
      const k = key as keyof Field;
      const s = key as keyof FieldFormData;

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

// export async function deleteFieldAction(_previousState: unknown, id: string) {
//   const res = await baseFetch({
//     path: `${SERVER_URL}/api/fields/${id}`,
//     method: "DELETE",
//     body: undefined,
//   });
//   if (res.ok) {
//     redirect("/fields");
//   }
//   const data = await res.json();
//   return data;
//   // return toResponseError(data);
// }
