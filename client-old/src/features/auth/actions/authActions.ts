"use server";

import { EmailFormData, RegFormData } from "../validators";
import { SERVER_URL } from "@/lib/serverUrl";
import { toResponseError } from "@/lib/responseError";

export async function createUserAction(
  _prevState: unknown,
  formData: RegFormData,
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

  const data = await res.json();
  return { success: false, errors: toResponseError(data) };
}

export async function resendVerifyEmailAction(
  _prevState: unknown,
  formData: EmailFormData,
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
  const data = await res.json();
  return { success: false, errors: toResponseError(data) };
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
  const data = await res.json();
  return { success: false, errors: toResponseError(data) };
}
