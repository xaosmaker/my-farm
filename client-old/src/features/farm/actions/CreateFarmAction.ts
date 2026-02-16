"use server";

import { FarmFormData } from "@/features/farm/farmValidators";
import { signOut } from "@/lib/auth";
import { baseRequest } from "@/lib/baseRequest";
import { toResponseError } from "@/lib/responseError";
import { SERVER_URL } from "@/lib/serverUrl";
import { redirect } from "next/navigation";

export async function CreateFarmAction(
  _prevState: unknown,
  formData: FarmFormData,
) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/farms`,
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (res.ok) {
    await signOut();
    redirect("/login");
  }
  const data = await res.json();
  return toResponseError(data);
}
