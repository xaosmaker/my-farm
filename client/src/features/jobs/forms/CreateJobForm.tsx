"use client";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Jobs, jobValidator } from "../jobValidators";
import { Supply } from "@/types/sharedTypes";
import BaseForm from "@/components/BaseForm";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { JOB_TYPES } from "../types";
import { DateTimePicker } from "@/components/DateTimePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useActionState, useTransition } from "react";
import { createJobAction } from "../actions/createJobAction";
import { Textarea } from "@/components/ui/textarea";

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
    formState: { errors },
  } = useForm<Jobs>({
    resolver: zodResolver(jobValidator),
    defaultValues: {
      fieldId: fieldId,
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
  const [_, action] = useActionState(createJobAction, undefined);
  const [isPending, startTransition] = useTransition();
  const jobSupplies = useWatch({ control, name: "jobSupplies" });

  const onSubmit = (data: Jobs) => {
    startTransition(() => {
      action(data);
    });
  };

  return (
    <BaseForm
      cardTitle="Create Job"
      cardDescription="Create a Job for field"
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
            Submit
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
          <Controller
            control={control}
            name="jobType"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="jobType">Select a Job Type</FieldLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue defaultValue="Select a job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((item) => {
                      return (
                        <SelectItem key={item} value={item}>
                          {item.toUpperCase()}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Description</FieldLabel>
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
                <FieldLabel>Select Job Date and time</FieldLabel>
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
        {fields.map((fiel, index) => (
          <FieldGroup key={fiel.id} className="relative mt-10">
            <Button
              type="button"
              variant="ghost"
              className="absolute top-0 right-0 -translate-y-1/2"
              onClick={() => remove(index)}
            >
              <X />
            </Button>

            <Controller
              control={control}
              name={`jobSupplies.${index}.supplyId`}
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`supplyId${index}`}>Supply</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue defaultValue="Select a supply" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplies.map((supply) => (
                        <SelectItem
                          key={supply.id}
                          value={supply.id.toString()}
                        >
                          {supply.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field
              data-invalid={
                errors.jobSupplies && errors.jobSupplies[index]?.quantity
              }
            >
              <FieldLabel htmlFor={`quantity${index}`}>Quantity</FieldLabel>
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
            Add supplies
          </Button>
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
