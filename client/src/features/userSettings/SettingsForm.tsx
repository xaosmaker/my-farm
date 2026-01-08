"use client";
import { useForm } from "react-hook-form";
import ControlledSelect from "@/components/ControlledSelect";
import BaseForm from "@/components/BaseForm";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { useActionState, useTransition } from "react";
import { updateSettingsAction } from "./actions";
import { UserSettings } from "@/types/sharedTypes";

export default function SettingsForm({ settings }: { settings: UserSettings }) {
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
      cardTitle="Αλλαγή ρυθμίσεων"
      cardDescription="Αλλάξτε τής ρυθμίσεις σας"
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
              Αποθήκευση
            </Button>
          </>
        )
      }
    >
      <form id="change-settings-form" onSubmit={handleSubmit(onFormSubmit)}>
        <Field>
          <FieldLabel className="px-2 text-xs">
            Μονάδα μέτρησής εδάφους
          </FieldLabel>
          <ControlledSelect
            control={control}
            name="landUnit"
            placeholder="Μονάδα μέτρησής εδάφους"
            values={[
              { value: "stremata", label: "Στρέμματα" },
              { value: "hectares", label: "Εκτάρια" },
              { value: "m2", label: "Τετραγωνικά μέτρα" },
            ]}
          />
        </Field>
      </form>
    </BaseForm>
  );
}
