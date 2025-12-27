"use server";

import { baseRequest } from "@/lib/baseRequest";
import { SuppliesRequest } from "../validators";
import { SERVER_URL } from "@/lib/serverUrl";
import { redirect } from "next/navigation";

export async function createSupplyAction(
  _state: undefined,
  formData: SuppliesRequest,
) {
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
