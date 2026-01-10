"use client";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobFormData, jobValidator } from "../jobValidators";
import { Supply } from "@/types/sharedTypes";
import BaseForm from "@/components/BaseForm";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { JOB_TYPES } from "../types";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useActionState, useTransition } from "react";
import { createJobAction } from "../actions/createJobAction";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { engToGreek } from "@/lib/translateMap";
import ControlledSelect from "@/components/ControlledSelect";

export default function CreateJobForm({
  fieldId,
  supplies,
}: {
  fieldId: number;
  supplies: Supply[];
}) {
  const {
    control,
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobValidator),
    mode: "onChange",
    defaultValues: {
      fieldId: fieldId,
      jobDate: undefined,
      description: "",
      jobType: "spraying",
      jobSupplies: [],
    },
  });

  console.log(watch("jobDate").toISOString());
  const { fields, append, remove } = useFieldArray({
    control,
    name: "jobSupplies",
  });
  const [_, action] = useActionState(createJobAction, undefined);
  const [isPending, startTransition] = useTransition();
  const jobSupplies = useWatch({ control, name: "jobSupplies" });

  const onSubmit = (data: JobFormData) => {
    startTransition(() => {
      action(data);
    });
  };

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
              onClick={() => remove(index)}
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
            <Field
              data-invalid={
                errors.jobSupplies && errors.jobSupplies[index]?.quantity
              }
            >
              <FieldLabel htmlFor={`quantity${index}`}>Ποσότητα</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  id={`quantity${index}`}
                  {...register(`jobSupplies.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                />
                {supplies &&
                  supplies.find(
                    (ele) =>
                      ele.id ===
                      parseInt(
                        jobSupplies ? jobSupplies[index]?.supplyId : "0",
                      ),
                  )?.measurementUnit}
              </div>
              {errors.jobSupplies && errors.jobSupplies[index]?.quantity && (
                <FieldError
                  errors={[
                    {
                      message: errors.jobSupplies[index].quantity.message,
                    },
                  ]}
                />
              )}
            </Field>
          </FieldGroup>
        ))}
        <FieldGroup className="flex w-full flex-row">
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => append({ quantity: 0, supplyId: "" })}
            type="button"
            disabled={isPending}
          >
            Προσθήκη εφοδίων
          </Button>
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
