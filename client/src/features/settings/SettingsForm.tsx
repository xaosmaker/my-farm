"use client";

import { useForm } from "react-hook-form";
import { landUnits } from "@/lib/constants";
import { useTranslations } from "next-intl";
import BaseForm from "@/components/BaseForm";
import ControlledSelect from "@/components/ControlledSelect";
import { useActionState, useTransition } from "react";
import { updateSettingsAction } from "./settingsActions";
import ServerError from "@/components/ServerError";
import { MUnit, UserSettings } from "@/types/globalTypes";

export default function SettingsForm({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Pick<UserSettings, "landUnit">>({
    mode: "onChange",
    defaultValues: {
      landUnit: userSettings.landUnit || "",
    },
  });
  const ut = useTranslations("Units");
  const t = useTranslations("Settings");
  const [state, action] = useActionState(updateSettingsAction, undefined);
  const [isPending, startTransition] = useTransition();
  function onSubmit(data: Pick<UserSettings, "landUnit">) {
    if (!isDirty) {
      return;
    }
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      submitButton={t("formButton")}
      submitFormName="update-settings"
      formTitle={t("formTitle")}
      formDesc={t("formDesc")}
      isPending={isPending}
    >
      <form id="update-settings" onSubmit={handleSubmit(onSubmit)}>
        <ControlledSelect
          label={t("landUnit")}
          ariaLabel={t("ariaLabel")}
          control={control}
          name="landUnit"
          selectItems={landUnits.map((unit) => ({
            value: unit,
            label: ut(unit as MUnit),
          }))}
        />
        {state?.errors && <ServerError errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
