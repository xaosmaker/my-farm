"use server";

import { revalidatePath } from "next/cache";
import { updateSettings } from "./settingsFetchers";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";
import { UserSettings } from "@/types/globalTypes";

export async function updateSettingsAction(
  _prevState: unknown,
  formData: Pick<UserSettings, "landUnit">,
) {
  const t = await getTranslations("Global.Error");
  const res = await updateSettings(formData);
  if (res.ok) {
    revalidatePath("/settings");
    return { success: true, errors: undefined };
  }
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
