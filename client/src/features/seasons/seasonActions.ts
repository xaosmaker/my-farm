"use server";

import { redirect } from "next/navigation";
import { baseFetch } from "@/lib/baseFetch";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function createSeasonAction(
  _previousState: unknown,
  formData: unknown,
) {
  if (typeof formData === "object" && formData) {
    if ("areaInMeters" in formData) {
      formData.areaInMeters = parseFloat(formData.areaInMeters as string);
    }
    if ("crop" in formData) {
      formData.crop = parseInt(formData.crop as string);
    }
  } else {
    return;
  }

  if (!("fieldId" in formData)) {
    // check if the key dont exist
    return;
  }

  const res = await baseFetch({
    path: `/api/seasons/${formData.fieldId}`,
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    return redirect(`/fields/${formData.fieldId}`);
  }

  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}

export async function updateSeasonAction(
  _previousState: unknown | undefined,
  formData: unknown,
) {
  if (typeof formData !== "object" || !formData) {
    return;
  }
  if (!("id" in formData)) {
    return;
  }
  if (Object.keys(formData).length > 1) {
    const res = await baseFetch({
      path: `/api/seasons/${formData.id}`,
      method: "PATCH",
      body: formData,
    });

    if (res.ok) {
      return redirect(`/seasons/${formData.id}`);
    }

    const t = await getTranslations("Global.Error");
    const data = await res.json();
    return { success: false, errors: serverErrorDTO(data, t) };
  }
  return undefined;
}

export async function deleteSeasonAction(
  _prevState: unknown,
  seasonId: string,
) {
  const res = await baseFetch({
    path: `/api/seasons/${seasonId}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    revalidatePath("/seasons");
    return { success: true, errors: undefined };
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
