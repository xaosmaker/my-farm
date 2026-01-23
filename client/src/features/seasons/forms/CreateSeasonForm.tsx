"use client";

import BaseForm from "@/components/BaseForm";
import { engToGreek } from "@/lib/translateMap";
import { Field as FieldData, Season, Supply } from "@/types/sharedTypes";
import { Controller, useForm } from "react-hook-form";
import { SeasonRequest, seasonValidators } from "../validators";
import ControlledInput from "@/components/ControlledInput";
import ControlledSelect from "@/components/ControlledSelect";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useActionState, useTransition } from "react";
import ServerErrors from "@/components/ServerErrors";
import {
  createSeasonAction,
  updateSeasonAction,
} from "../actions/seasonActions";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

function CreateSeasonForm({
  field,
  supplies,
  season,
}: {
  field: FieldData;
  supplies: Supply[];
  season?: Season;
}) {
  const { control, reset, handleSubmit, formState } = useForm<SeasonRequest>({
    mode: "onChange",
    resolver: zodResolver(seasonValidators),
    criteriaMode: "all",
    defaultValues: {
      name: season?.name || "",
      areaInMeters:
        season?.areaInMeters.toString() || field.areaInMeters.toString(),
      crop: season?.crop.toString() || undefined,
      fieldId: field.id,
      startSeason: season ? new Date(season.startSeason) : undefined,
      finishSeason: season?.finishSeason
        ? new Date(season.finishSeason)
        : undefined,
    },
  });

  const [state, action] = useActionState(
    season
      ? updateSeasonAction.bind(null, field.id.toString())
      : createSeasonAction.bind(null, field.id.toString()),
    undefined,
  );
  const dirty = formState.dirtyFields;
  const [isPending, startTransition] = useTransition();
  function onFormSubmit(data: SeasonRequest) {
    let sendData: { [key: string]: unknown } = {};
    if (season) {
      sendData["id"] = season.id;
      for (const key in dirty) {
        const k = key as keyof SeasonRequest;
        sendData[key] = data[k];
      }
    } else {
      sendData = { ...data };
    }
    startTransition(() => {
      action(sendData);
    });
  }
  const t = useTranslations(
    season ? "Seasons.Form.Update" : "Seasons.Form.Create",
  );

  return (
    <BaseForm
      cardTitle={t("title")}
      cardDescription={`${t("desc")} \n '${field.name} ${field.areaInMeters} ${engToGreek.get(field.landUnit) || field.landUnit}'`}
      buttonChildren={
        <>
          <Button disabled={isPending} onClick={() => reset()}>
            Reset
          </Button>
          <Button disabled={isPending} type="submit" form="create-season-form">
            {t("submitButton")}
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-2"
        id="create-season-form"
      >
        <ControlledInput control={control} name="name" label={t("name")} />
        <ControlledInput
          control={control}
          name="areaInMeters"
          label={engToGreek.get(field.landUnit) || field.landUnit}
        />
        <ControlledSelect
          control={control}
          name="crop"
          placeholder={t("cropType")}
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
              <FieldLabel>{t("startSeason")}</FieldLabel>
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
              <FieldLabel>{t("finishSeason")}</FieldLabel>
              <DateTimePicker
                value={field.value || undefined}
                onChange={field.onChange}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {state && <ServerErrors errors={state} />}
      </form>
    </BaseForm>
  );
}
export default dynamic(() => Promise.resolve(CreateSeasonForm), { ssr: false });
