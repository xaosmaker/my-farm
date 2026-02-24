"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useActionState, useTransition } from "react";
import {
  createSeasonAction,
  updateSeasonAction,
} from "@/features/seasons/seasonActions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ServerError from "@/components/ServerError";
import { seasonSchema, SeasonSchema } from "../seasonSchema";
import { useTranslations } from "next-intl";
import { MUnit, Season, Supply, UserSettings } from "@/types/globalTypes";
import { FieldGroup } from "@/components/ui/field";
import ControlledDateTimePicker from "@/components/ControlledDateTimePicker";
import ControlledSelect from "@/components/ControlledSelect";

export default function CreateSeasonForm({
  fieldId,
  season,
  userSettings,
  supplies,
}: {
  fieldId: string;
  season?: Season;
  userSettings: UserSettings;
  supplies: Supply[];
}) {
  const et = useTranslations("Global.Error");
  const t = useTranslations(season ? "Seasons.Update" : "Seasons.Create");
  const ut = useTranslations("Units");

  const { control, reset, handleSubmit, formState } = useForm<SeasonSchema>({
    mode: "onChange",
    resolver: zodResolver(seasonSchema(et, t("name"))),
    shouldFocusError: true,
    defaultValues: {
      name: season?.name || "",
      startSeason: season?.startSeason
        ? new Date(season.startSeason)
        : undefined,
      finishSeason: season?.finishSeason
        ? new Date(season.finishSeason)
        : undefined,
      areaInMeters: season?.areaInMeters?.toString() || "",
      fieldId: parseInt(fieldId),
      crop: season?.crop.toString() || "",
    },
  });

  const suppliesData = supplies.map((supply) => ({
    label: supply.name,
    value: supply.id.toString(),
  }));

  const [state, action] = useActionState(
    season ? updateSeasonAction : createSeasonAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();
  const dirty = formState.dirtyFields;

  function onSubmit(data: SeasonSchema) {
    let sendData: { [key: string]: unknown } = {};

    if (season) {
      sendData["id"] = season.id;
      for (const key in dirty) {
        const k = key as keyof SeasonSchema;
        sendData[key] = data[k];
      }
    } else {
      sendData = { ...data };
    }
    startTransition(() => {
      action(sendData);
    });
  }

  return (
    <BaseForm
      submitButton={t("submitButton")}
      formTitle={t("title")}
      formDesc={t("desc")}
      submitFormName="create-season-form"
      isPending={isPending}
      resetForm={reset}
    >
      <form id="create-season-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label={t("name")} />

          <ControlledInput
            control={control}
            name="areaInMeters"
            label={ut(userSettings.landUnit as MUnit)}
          />
          <ControlledDateTimePicker
            label={t("startSeason")}
            name="startSeason"
            control={control}
          />
          {season && (
            <ControlledDateTimePicker
              label={t("finishSeason")}
              control={control}
              name="finishSeason"
            />
          )}

          <ControlledSelect
            ariaLabel={t("cropName")}
            selectItems={suppliesData}
            control={control}
            name="crop"
            label={t("cropName")}
          />
        </FieldGroup>
        {state?.errors && <ServerError errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
