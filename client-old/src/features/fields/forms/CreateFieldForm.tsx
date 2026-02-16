"use client";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  type FieldFormData,
  fieldValidator,
} from "@/features/fields/fieldValidators";
import { Switch } from "@/components/ui/switch";
import { useActionState, useTransition } from "react";
import {
  createFieldAction,
  updateFieldAction,
} from "@/features/fields/actions/actions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import { Field as FieldData } from "@/types/sharedTypes";
import { UserSettings } from "@/types/sharedTypes";
import ServerErrors from "@/components/ServerErrors";
import { useTranslations } from "next-intl";

export default function CreateFieldForm({
  landUnit,
  oldData,
}: {
  landUnit: UserSettings;
  oldData?: FieldData;
}) {
  const { control, reset, handleSubmit } = useForm<FieldFormData>({
    mode: "onChange",
    resolver: zodResolver(fieldValidator),
    shouldFocusError: true,
    defaultValues: {
      landUnit: landUnit.landUnit,
      name: oldData?.name || "",
      isOwned: oldData?.isOwned || false,
      fieldLocation: oldData?.fieldLocation || "",
      areaInMeters: oldData?.areaInMeters.toString() || "",
      govPDF: null,
    },
  });

  const [state, action] = useActionState(
    oldData ? updateFieldAction : createFieldAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: FieldFormData) {
    const newData: { oldData: undefined | FieldData; data: FieldFormData } = {
      oldData: undefined,
      data,
    };
    if (oldData) {
      newData.oldData = oldData;
    }
    startTransition(() => {
      action(newData);
    });
  }
  const t = useTranslations(
    oldData ? "Fields.Form.Update" : "Fields.Form.Create",
  );

  return (
    <BaseForm
      cardTitle={t("title")}
      cardDescription={t("desc")}
      buttonChildren={
        <>
          <Button
            disabled={isPending}
            onClick={() => reset()}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
          <Button type="submit" form="create-field-form" disabled={isPending}>
            {t("submitButton")}
          </Button>
        </>
      }
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
            label={`${t("areaInMeters")} ${landUnit.landUnit}`}
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
                  id="is owned"
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
        {state && <ServerErrors errors={state} />}
      </form>
    </BaseForm>
  );
}
