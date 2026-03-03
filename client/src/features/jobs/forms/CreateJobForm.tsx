"use client";

import { useForm, useFieldArray, Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useActionState, useTransition } from "react";
import { createJobAction } from "../jobsActions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ServerError from "@/components/ServerError";
import { jobSchema, JobSchema } from "../jobsSchema";
import { useTranslations } from "next-intl";
import { Season, Supply } from "@/types/globalTypes";
import { FieldGroup } from "@/components/ui/field";
import ControlledDateTimePicker from "@/components/ControlledDateTimePicker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { JOB_TYPES } from "@/lib/globalData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

interface CreateJobFormProps {
  season: Season;
  supplies: Supply[];
}

function ControlledSelectInput<T extends FieldValues>({
  control,
  name,
  label,
  selectItems,
  required,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  selectItems: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel className="ml-2 text-xs">
              {label} {required && <span className="text-red-500">*</span>}
            </FieldLabel>
          )}
          <Select onValueChange={onChange} value={value as string}>
            <SelectTrigger type="button" className="w-full">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {selectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}

export default function CreateJobForm({ season, supplies }: CreateJobFormProps) {
  const et = useTranslations("Global.Error");
  const t = useTranslations("Jobs.Create");

  const {
    control,
    reset,
    handleSubmit,
    watch,
  } = useForm<JobSchema>({
    mode: "onChange",
    resolver: zodResolver(jobSchema(et)),
    defaultValues: {
      fieldId: season.fieldId,
      seasonId: season.id,
      areaInMeters: season.areaInMeters.toString(),
      jobDate: undefined,
      description: "",
      jobType: "spraying",
      jobSupplies: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jobSupplies",
  });

  const [state, action] = useActionState(createJobAction, undefined);
  const [isPending, startTransition] = useTransition();

  const jobType = watch("jobType");

  const jobTypeOptions = JOB_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  const supplyOptions = supplies.map((supply) => ({
    value: supply.id.toString(),
    label: supply.name,
  }));

  function onSubmit(data: JobSchema) {
    const formData = {
      fieldId: season.fieldId,
      seasonId: season.id,
      jobType: data.jobType,
      description: data.description || "",
      jobDate: data.jobDate,
      areaInMeters: data.areaInMeters,
      jobSupplies: data.jobSupplies.map((s) => ({
        quantity: s.quantity,
        supplyId: s.supplyId,
      })),
    };
    startTransition(() => {
      action(formData as unknown as Record<string, unknown>);
    });
  }

  const requiresSupplies = ["spraying", "fertilizing", "sowing", "harvesting", "planting"].includes(jobType || "");

  return (
    <BaseForm
      submitButton={t("submitButton")}
      formTitle={t("title")}
      formDesc={t("desc")}
      submitFormName="create-job-form"
      isPending={isPending}
      resetForm={reset}
    >
      <form id="create-job-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledSelectInput
            control={control}
            name="jobType"
            label={t("jobType")}
            selectItems={jobTypeOptions}
            required
          />

          <ControlledInput
            control={control}
            name="description"
            label={t("description")}
          />

          <ControlledInput
            control={control}
            name="areaInMeters"
            label={t("areaInMeters", { unit: season.landUnit })}
            required
          />

          <ControlledDateTimePicker
            control={control}
            name="jobDate"
            label={t("jobDate")}
            required
          />
        </FieldGroup>

        {requiresSupplies && (
          <>
            <h3 className="mt-4 text-center font-bold">{t("suppliesTitle")}</h3>
            
            {fields.map((field, index) => (
              <FieldGroup key={field.id} className="relative mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-0 right-0 -translate-y-full"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <ControlledSelectInput
                  control={control}
                  name={`jobSupplies.${index}.supplyId`}
                  label={t("supply")}
                  selectItems={supplyOptions}
                  required
                />

                <ControlledInput
                  control={control}
                  name={`jobSupplies.${index}.quantity`}
                  label={t("quantity")}
                  required
                />
              </FieldGroup>
            ))}

            <Button
              type="button"
              variant="ghost"
              className="mt-2 text-xs"
              onClick={() => append({ quantity: "", supplyId: "" })}
              disabled={isPending}
            >
              {t("addSupply")}
            </Button>
          </>
        )}

        {state?.errors && <ServerError errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
