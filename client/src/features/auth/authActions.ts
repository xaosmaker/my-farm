"use server";

import { RegisterSchema } from "./schemas/registerSchema";
import { SERVER_URL } from "@/lib/serverUrl";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";

export async function registerAction(
  _prevState: unknown,
  formData: RegisterSchema,
) {
  const t = await getTranslations("Global.Error");
  const res = await fetch(`${SERVER_URL}/api/users/create`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },

    body: JSON.stringify(formData),
  });
  if (res.ok) {
    return { success: true, errors: undefined };
  }
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
