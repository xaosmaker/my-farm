"use server";

import { SERVER_URL } from "@/lib/serverUrl";
import { FieldFormData } from "@/features/fields/fieldValidators";
import { baseRequest } from "@/lib/baseRequest";
import { redirect } from "next/navigation";
import { toResponseError } from "@/lib/responseError";
import { Field } from "@/types/sharedTypes";

export async function createFieldAction(
  _previousState: unknown | undefined,
  formData: { oldData: undefined | Field; data: FieldFormData },
) {
  const d = {
    name: formData.data.name,
    epsg2100Boundary: null,
    epsg4326Boundary: null,
    mapLocation: null,
    fieldLocation: formData.data.fieldLocation,
    areaInMeters: parseFloat(formData.data.areaInMeters),
    isOwned: formData.data.isOwned,
  };
  const res = await baseRequest({
    url: `${SERVER_URL}/api/fields`,
    method: "POST",
    body: JSON.stringify(d),
  });

  if (res.ok) {
    return redirect("/fields");
  }

  const data = await res.json();
  return toResponseError(data);
}

export async function updateFieldAction(
  _previousState: unknown | undefined,
  formData: { oldData: undefined | Field; data: FieldFormData },
) {
  const d: {
    [k: string]: string | number | boolean;
  } = {};
  if (formData.oldData) {
    for (const key in formData.data) {
      const k = key as keyof Field;
      const s = key as keyof FieldFormData;

      if (
        s === "govPDF" ||
        formData.oldData[k]?.toString() === formData.data[s].toString()
      ) {
        continue;
      }
      if (s === "areaInMeters") {
        d[key] = parseFloat(formData.data[s]);
      } else {
        d[key] = formData.data[s];
      }
    }
  }

  if (Object.keys(d).length > 0) {
    const res = await baseRequest({
      url: `${SERVER_URL}/api/fields/${formData.oldData?.id}`,
      method: "PATCH",
      body: JSON.stringify(d),
    });

    console.log(res);
    if (res.ok) {
      return redirect("/fields");
    }

    const data = await res.json();
    return toResponseError(data);
  }
  return undefined;
}

export async function deleteFieldAction(_previousState: undefined, id: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/fields/${id}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    redirect("/fields");
  }
  return undefined;
}
