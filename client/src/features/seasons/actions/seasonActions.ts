"use server";

import { baseRequest } from "@/lib/baseRequest";
import { toResponseError } from "@/lib/responseError";
import { SERVER_URL } from "@/lib/serverUrl";
import { redirect } from "next/navigation";

export async function createSeasonAction(
  _prevState: unknown,
  formData: unknown,
) {
  if (typeof formData !== "object") {
    return [{ message: "unknow type of data" }];
  }
  if (formData && "areaInMeters" in formData) {
    formData.areaInMeters = parseFloat(formData.areaInMeters as string);
  }
  if (formData && "crop" in formData) {
    formData.crop = parseInt(formData.crop as string);
  }
  if (formData && !("fieldId" in formData)) {
    return [{ message: "field id Doesnt exist" }];
  }
  const res = await baseRequest({
    url: `${SERVER_URL}/api/seasons/${formData?.fieldId}`,
    method: "POST",
    body: JSON.stringify(formData),
  });
  if (res.ok) {
    redirect(`/fields/${formData?.fieldId}`);
  }
  const data = await res.json();
  return toResponseError(data);
}
