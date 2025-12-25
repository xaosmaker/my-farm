"use server";

import { SERVER_URL } from "@/lib/serverUrl";
import { FieldFormData } from "./validators";
import { baseRequest } from "@/lib/baseRequest";
import { redirect } from "next/navigation";

export async function createFieldAction(
  _previousState: undefined,
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
  const res = await baseRequest({
    url: `${SERVER_URL}/api/fields`,
    method: "POST",
    body: JSON.stringify(d),
  });

  if (res.ok) {
    return redirect("/fields");
  }

  return undefined;
}
