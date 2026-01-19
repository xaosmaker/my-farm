"use server";

import { baseRequest } from "@/lib/baseRequest";
import { toResponseError } from "@/lib/responseError";
import { SERVER_URL } from "@/lib/serverUrl";
import { redirect } from "next/navigation";

export async function updateSupplyAction(_state: undefined, formData: unknown) {
  if (
    typeof formData === "object" &&
    formData &&
    Object.keys(formData).length <= 1
  ) {
    return;
  }

  if (!(typeof formData === "object" && formData && "id" in formData)) {
    return;
  }

  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies/${formData.id}`,
    method: "PATCH",
    body: JSON.stringify(formData),
  });

  if (res.ok) {
    redirect("/supplies");
  }
  return undefined;
}
export async function createSupplyAction(_state: undefined, formData: unknown) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies`,
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (res.ok) {
    redirect("/supplies");
  }
  return undefined;
}

export async function deleteSupplyAction(_prevState: unknown, id: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies/${id}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    redirect("/supplies");
  }
  const data = await res.json();
  return toResponseError(data);
}
