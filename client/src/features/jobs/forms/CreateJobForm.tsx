"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useActionState, useTransition, useEffect } from "react";
import { createJobAction } from "../jobsActions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ServerError from "@/components/ServerError";
import { jobSchema, JobSchema } from "../jobsSchema";
import { Messages, useTranslations } from "next-intl";
import { Season, Supply } from "@/types/globalTypes";
import { FieldError, FieldGroup } from "@/components/ui/field";
import ControlledDateTimePicker from "@/components/ControlledDateTimePicker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { JOB_TYPES } from "@/lib/globalData";
import { roundTo6 } from "@/lib/utils";
import ControlledSelect from "@/components/ControlledSelect";

interface JobSuppliesRef {
  quantity: string;
  quantityPerUnit: string;
  supplyId: string;
  area: string;
}
let jobSuppliesRef: JobSuppliesRef[] = [];

interface CreateJobFormProps {
  season: Season;
  supplies: Supply[];
}

export default function CreateJobForm({
  season,
  supplies,
}: CreateJobFormProps) {
  const et = useTranslations("Global.Error");
  const t = useTranslations("Jobs.Create");
  const jt = useTranslations("Jobs.Job");

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobSchema>({
    mode: "onChange",
    resolver: zodResolver(jobSchema(et, t("supply"))),
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

  const [jobSupplies, areaInMeters, jobType] = useWatch({
    control,
    name: ["jobSupplies", "areaInMeters", "jobType"],
  });

  useEffect(() => {
    if (jobSuppliesRef.length > 0) {
      jobSuppliesRef = [];
    }
  }, []);

  useEffect(() => {
    for (let i = 0; i < jobSupplies.length; i++) {
      if (jobSuppliesRef[i].supplyId != jobSupplies[i].supplyId) {
        jobSuppliesRef[i].supplyId = jobSupplies[i].supplyId;
      }
      if (
        jobSuppliesRef[i].quantityPerUnit != jobSupplies[i].quantityPerUnit ||
        areaInMeters != jobSuppliesRef[i].area
      ) {
        jobSuppliesRef[i].quantityPerUnit = jobSupplies[i].quantityPerUnit;
        const quantity = roundTo6(
          parseFloat(jobSupplies[i].quantityPerUnit) *
            (parseFloat(areaInMeters) || 1),
        );
        setValue(
          `jobSupplies.${i}.quantity`,
          isNaN(quantity) ? "0" : quantity.toString(),
          { shouldValidate: true },
        );
        jobSuppliesRef[i].quantity = isNaN(quantity)
          ? "0"
          : quantity.toString();

        if (jobSuppliesRef[i].area != areaInMeters) {
          jobSuppliesRef[i].area = areaInMeters;
          continue;
        }
        break;
      }

      if (jobSuppliesRef[i].quantity != jobSupplies[i].quantity) {
        const quantityPerUnit = roundTo6(
          parseFloat(jobSupplies[i].quantity) / (parseFloat(areaInMeters) || 1),
        );

        jobSuppliesRef[i].quantity = jobSupplies[i].quantity;
        setValue(
          `jobSupplies.${i}.quantityPerUnit`,
          isNaN(quantityPerUnit) ? "0" : quantityPerUnit.toString(),
          { shouldValidate: true },
        );

        jobSuppliesRef[i].quantityPerUnit = isNaN(quantityPerUnit)
          ? "0"
          : quantityPerUnit.toString();

        break;
      }
    }
  }, [jobSupplies, areaInMeters, setValue]);

  const jobTypeOptions = JOB_TYPES.map((type) => ({
    value: type,
    label: jt(type as keyof Messages["Jobs"]["Job"]),
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
          <ControlledSelect
            ariaLabel={t("jobType")}
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

        <h2 className="mt-4 text-center font-bold">{t("suppliesTitle")}</h2>

        {errors.jobSupplies?.message && (
          <FieldError errors={[{ message: errors.jobSupplies.message }]} />
        )}

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

            <ControlledSelect
              ariaLabel={t("supply")}
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

            <ControlledInput
              control={control}
              name={`jobSupplies.${index}.quantityPerUnit`}
              label={`${t("quantity")} / ${season.landUnit}`}
            />
          </FieldGroup>
        ))}

        <Button
          type="button"
          variant="ghost"
          className="mt-2 text-xs"
          onClick={() => {
            append({ quantity: "", supplyId: "", quantityPerUnit: "" });
            jobSuppliesRef.push({
              quantity: "",
              supplyId: "",
              quantityPerUnit: "",
              area: areaInMeters,
            });
          }}
          disabled={isPending}
        >
          {t("addSupply")}
        </Button>

        {state?.errors && <ServerError errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
