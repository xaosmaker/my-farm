"use client";
// TODO: this can be better for now is working
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  JobFormData,
  JobSuppliesFormData,
  jobValidator,
} from "../jobValidators";
import { JOB_TYPES, Season, Supply } from "@/types/sharedTypes";
import BaseForm from "@/components/BaseForm";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useActionState, useEffect, useTransition } from "react";
import { createJobAction } from "../actions/createJobAction";
import { Textarea } from "@/components/ui/textarea";
import { engToGreek } from "@/lib/translateMap";
import ControlledSelect from "@/components/ControlledSelect";
import ControlledInput from "@/components/ControlledInput";
import ServerErrors from "@/components/ServerErrors";
import { roundTo6 } from "@/lib/utils";

type JobSuppliesFormDataArea = JobSuppliesFormData & { area: string };
let jobSuppliesRef: JobSuppliesFormDataArea[] = [];
export default function CreateJobForm({
  fieldId,
  season,
  supplies,
}: {
  fieldId: number;
  season: Season;
  supplies: Supply[];
}) {
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobValidator),
    mode: "onChange",
    defaultValues: {
      fieldId: fieldId,
      areaInMeters: season.areaInMeters.toString(),
      seasonId: season.id,
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
  const [jobSupplies, areaInMeters] = useWatch({
    control,
    name: ["jobSupplies", "areaInMeters"],
  });

  const onSubmit = (data: JobFormData) => {
    startTransition(() => {
      action(data);
    });
  };
  useEffect(() => {
    if (jobSuppliesRef.length > 0) {
      jobSuppliesRef = [];
    }
  }, []);

  useEffect(() => {
    for (let i = 0; i < jobSupplies.length; i++) {
      //update the supply id if change
      if (jobSuppliesRef[i].supplyId != jobSupplies[i].supplyId) {
        jobSuppliesRef[i].supplyId = jobSupplies[i].supplyId;
      }
      // update the quantity
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

      //update the quantity per unit
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

  return (
    <BaseForm
      cardTitle="Δημιουργία εργασίας"
      cardDescription="Δημιουργήστε την εργασία σας για το χωράφι σας"
      buttonChildren={
        <>
          <Button
            disabled={isPending}
            variant="ghost"
            type="reset"
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button disabled={isPending} type="submit" form="create-jobs">
            Δημιουργία εργασίας
          </Button>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
        id="create-jobs"
      >
        <FieldGroup>
          <ControlledSelect
            control={control}
            placeholder="Κατηγορία"
            name="jobType"
            values={JOB_TYPES.map((type) => ({
              value: type,
              label: engToGreek.get(type) || type,
            }))}
          />

          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Περιγραφή</FieldLabel>
                <Textarea value={field.value} onChange={field.onChange} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {errors.jobSupplies?.message && (
            <FieldError errors={[{ message: errors.jobSupplies.message }]} />
          )}
          <ControlledInput
            control={control}
            name="areaInMeters"
            label={engToGreek.get(season.landUnit) || season.landUnit}
          />

          <Controller
            control={control}
            name="jobDate"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Ημερομηνία εργασίας</FieldLabel>
                <DateTimePicker value={field.value} onChange={field.onChange} />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {errors.jobSupplies?.message && (
            <FieldError errors={[{ message: errors.jobSupplies.message }]} />
          )}
        </FieldGroup>

        {fields.length >= 1 && (
          <h3 className="mt-4 text-center font-bold">Εφόδια</h3>
        )}
        {fields.map((fiel, index) => (
          <FieldGroup key={fiel.id} className="relative mt-10">
            <Button
              type="button"
              variant="ghost"
              className="absolute top-0 right-0 -translate-y-full"
              onClick={() => {
                remove(index);
                jobSuppliesRef = jobSuppliesRef.filter((item, ind) =>
                  ind != index ? item : undefined,
                );
              }}
            >
              <X />
            </Button>

            <ControlledSelect
              control={control}
              name={`jobSupplies.${index}.supplyId`}
              placeholder="Επιλογή εφοδίων"
              values={supplies.map((supply) => ({
                value: supply.id.toString(),
                label: supply.name,
              }))}
            />
            <ControlledInput
              control={control}
              name={`jobSupplies.${index}.quantity`}
              label={`${engToGreek.get(supplies.find((item) => item.id == parseInt(jobSupplies[index || 0]?.supplyId))?.measurementUnit || "") || "Ποσότητα"}`}
            />
            <ControlledInput
              control={control}
              name={`jobSupplies.${index}.quantityPerUnit`}
              label={`${engToGreek.get(supplies.find((item) => item.id == parseInt(jobSupplies[index || 0]?.supplyId))?.measurementUnit || "") || "Ποσότητα"} ανα ${engToGreek.get(season.landUnit) || season.landUnit}`}
            />
          </FieldGroup>
        ))}
        <FieldGroup className="flex w-full flex-row">
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => {
              append({ quantity: "", supplyId: "", quantityPerUnit: "" });
              jobSuppliesRef.push({
                quantity: "",
                supplyId: "",
                quantityPerUnit: "",
                area: areaInMeters,
              });
            }}
            type="button"
            disabled={isPending}
          >
            Προσθήκη εφοδίων
          </Button>
        </FieldGroup>
        {state && <ServerErrors errors={state} />}
      </form>
    </BaseForm>
  );
}
