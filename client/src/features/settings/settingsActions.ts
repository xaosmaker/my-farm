"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "./settingsFetchers";
import { UserSettings } from "./settingTypes";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";

export async function updateSettingsAction(
  _prevState: unknown,
  formData: Pick<UserSettings, "landUnit">,
) {
  const t = await getTranslations("Global.Error");
  const res = await updateSettings(formData);
  if (res.ok) {
    return revalidatePath("/settings");
  }
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
