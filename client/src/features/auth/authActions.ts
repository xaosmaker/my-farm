"use server";

import { RegisterSchema } from "./schemas/registerSchema";
import { SERVER_URL } from "@/lib/serverUrl";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";
import { ResendVerCodeSchema } from "./schemas/resendVerCodeSchema";

export async function registerAction(
  _prevState: unknown,
  formData: RegisterSchema,
) {
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
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}

export async function verifyEmailAction(
  _prevState: unknown,
  formData: { token: string },
) {
  const res = await fetch(`${SERVER_URL}/api/users/verify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (res.ok) {
    return { success: true, errors: undefined };
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}

export async function resendVerifyEmailAction(
  _prevState: unknown,
  formData: ResendVerCodeSchema,
) {
  const res = await fetch(`${SERVER_URL}/api/users/resendverify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (res.ok) {
    return { success: true, errors: undefined };
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
