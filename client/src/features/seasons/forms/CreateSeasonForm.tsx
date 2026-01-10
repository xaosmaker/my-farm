"use client";

import BaseForm from "@/components/BaseForm";
import { engToGreek } from "@/lib/translateMap";
import { Field as FieldData, Supply } from "@/types/sharedTypes";
import { Controller, useForm } from "react-hook-form";
import { SeasonRequest, seasonValidators } from "../validators";
import ControlledInput from "@/components/ControlledInput";
import ControlledSelect from "@/components/ControlledSelect";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

export default function CreateSeasonForm({
  field,
  supplies,
}: {
  field: FieldData;
  supplies: Supply[];
}) {
  const { control, reset, handleSubmit } = useForm<SeasonRequest>({
    mode: "onChange",
    resolver: zodResolver(seasonValidators),
    criteriaMode: "all",
    defaultValues: {
      name: "",
      areaInMeters: field.areaInMeters.toString(),
      crop: undefined,
      fieldID: field.id,
      startSeason: undefined,
      finishSeason: undefined,
    },
  });
  function onFormSubmit(data: SeasonRequest) {
    console.log(data);
  }

  return (
    <BaseForm
      cardTitle="Δημιουργία σεζόν"
      cardDescription={`Δημιουργία σεζόν για το χωράφι \n ${field.name} ${field.areaInMeters} ${engToGreek.get(field.landUnit) || field.landUnit}`}
      buttonChildren={
        <>
          <Button onClick={() => reset()}>Reset</Button>{" "}
          <Button type="submit" form="create-season-form">
            Δημιουργία σεζόν
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-2"
        id="create-season-form"
      >
        <ControlledInput control={control} name="name" label="Όνομα σεζόν" />
        <ControlledInput
          control={control}
          name="areaInMeters"
          label={engToGreek.get(field.landUnit) || field.landUnit}
        />
        <ControlledSelect
          control={control}
          name="crop"
          placeholder="Επιλογή σοδιάς"
          values={supplies.map((item) => ({
            value: item.id.toString(),
            label: item.name,
          }))}
        />

        <Controller
          control={control}
          name="startSeason"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Αρχή σεζόν</FieldLabel>
              <DateTimePicker value={field.value} onChange={field.onChange} />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="finishSeason"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Τέλος σεζόν</FieldLabel>
              <DateTimePicker
                value={field.value || undefined}
                onChange={field.onChange}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
    </BaseForm>
  );
}
