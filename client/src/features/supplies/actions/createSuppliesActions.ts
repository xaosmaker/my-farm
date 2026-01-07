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
  const dat = await res.json();
  console.log(res, dat);

  if (res.ok) {
    redirect("/supplies");
  }
  return undefined;
}

export async function deleteSupplyAction(_prevState: undefined, id: string) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/supplies/${id}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    redirect("/supplies");
  }
  return undefined;
}
