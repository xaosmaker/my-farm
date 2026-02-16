"use server";
import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import { UserSettings } from "@/types/sharedTypes";
import { redirect } from "next/navigation";

export async function updateSettingsAction(
  _prevState: unknown,
  formData: UserSettings,
) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/settings`,
    method: "POST",
    body: JSON.stringify(formData),
  });
  if (res.ok) {
    redirect("/settings");
  }

  return undefined;
}
