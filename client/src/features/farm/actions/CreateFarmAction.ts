"use server";

import { Farm } from "@/features/farm/farmValidators";
import { signOut } from "@/lib/auth";
import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { redirect } from "next/navigation";

export async function CreateFarmAction(_prevState: undefined, data: Farm) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/farms`,
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    await signOut();
    redirect("/login");
  }
  return undefined;
}
