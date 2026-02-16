"use client";
import { useForm } from "react-hook-form";
import ControlledSelect from "@/components/ControlledSelect";
import BaseForm from "@/components/BaseForm";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { useActionState, useTransition } from "react";
import { updateSettingsAction } from "./actions";
import { UserSettings } from "@/types/sharedTypes";
import { useTranslations } from "next-intl";

export default function SettingsForm({ settings }: { settings: UserSettings }) {
  const t = useTranslations("Settings");
  const tr = useTranslations("LandUnit");
  const { control, formState, reset, handleSubmit } = useForm<UserSettings>({
    mode: "onChange",
    defaultValues: {
      landUnit: settings.landUnit,
    },
  });
  const [_, action] = useActionState(updateSettingsAction, undefined);
  const [isPending, startTransition] = useTransition();
  function onFormSubmit(settings: UserSettings) {
    startTransition(() => {
      action(settings);
    });
  }

  return (
    <BaseForm
      cardTitle={t("formTitle")}
      cardDescription={t("formDesc")}
      buttonChildren={
        formState.isDirty && (
          <>
            <Button disabled={isPending} onClick={() => reset()}>
              Reset
            </Button>
            <Button
              disabled={isPending}
              form="change-settings-form"
              type="submit"
            >
              {t("formButton")}
            </Button>
          </>
        )
      }
    >
      <form id="change-settings-form" onSubmit={handleSubmit(onFormSubmit)}>
        <Field>
          <FieldLabel className="px-2 text-xs">{t("landUnit")}</FieldLabel>
          <ControlledSelect
            control={control}
            name="landUnit"
            placeholder={t("landUnit")}
            values={[
              { value: "stremata", label: tr("stremata") },
              { value: "hectares", label: tr("hectares") },
              { value: "m2", label: tr("m2") },
            ]}
          />
        </Field>
      </form>
    </BaseForm>
  );
}
