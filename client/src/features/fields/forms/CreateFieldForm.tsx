"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useActionState, useTransition } from "react";
import {
  createFieldAction,
  updateFieldAction,
} from "@/features/fields/actions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ServerError from "@/components/ServerError";
import { UserSettings } from "@/features/settings/settingTypes";
import { fieldSchema, FieldSchema } from "../fieldSchema";
import { useTranslations } from "next-intl";
import { MUnit } from "@/types/genetalTypes";
import { Field as UserField } from "../fieldTypes";

export default function CreateFieldForm({
  userSettings,
  userField,
}: {
  userSettings: UserSettings;
  userField?: UserField;
}) {
  const et = useTranslations("Global.Error");
  const t = useTranslations(userField ? "Fields.Update" : "Fields.Create");
  const ut = useTranslations("Units");
  const { control, reset, handleSubmit } = useForm<FieldSchema>({
    mode: "onChange",
    resolver: zodResolver(fieldSchema(et, t("name"))),
    shouldFocusError: true,
    defaultValues: {
      landUnit: userSettings.landUnit,
      name: userField?.name || "",
      isOwned: !!userField?.isOwned || false,
      fieldLocation: userField?.fieldLocation || "",
      areaInMeters: userField?.areaInMeters.toString() || "",
      govPDF: null,
    },
  });

  const [state, action] = useActionState(
    userField ? updateFieldAction.bind(null, userField) : createFieldAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: FieldSchema) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      submitButton={t("submitButton")}
      formTitle={t("title")}
      formDesc={t("desc")}
      submitFormName="create-field-form"
      isPending={isPending}
      resetForm={reset}
    >
      <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label={t("name")} />

          <ControlledInput
            control={control}
            name="fieldLocation"
            label={t("fieldLocation")}
          />
          <ControlledInput
            control={control}
            name="areaInMeters"
            label={`${t("areaInMeters")} ${ut(userSettings.landUnit as MUnit)}`}
          />

          <Controller
            control={control}
            name="isOwned"
            render={({ fieldState, field: { value, onChange } }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-row"
              >
                <Switch
                  className="grow-0 basis-8"
                  checked={value}
                  onCheckedChange={onChange}
                  aria-invalid={fieldState.invalid}
                  id="isOwned"
                />
                <FieldLabel htmlFor="isOwned" className="flex-1">
                  {t("owned")}
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {state?.errors && <ServerError errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
