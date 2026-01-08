"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { SuppliesRequest, suppliesValidator } from "../validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { createSupplyAction } from "../actions/createSuppliesActions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ControlledSelect from "@/components/ControlledSelect";

export default function CreateSupplyForm() {
  const { control, reset, handleSubmit } = useForm<SuppliesRequest>({
    mode: "onChange",
    resolver: zodResolver(suppliesValidator),
    shouldFocusError: true,
    defaultValues: {
      name: "",
      nickname: "",
      supplyType: "",
      measurementUnit: "",
    },
  });
  const [_, action] = useActionState(createSupplyAction, undefined);
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: SuppliesRequest) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      cardTitle="Δημιουργία εφοδίων"
      cardDescription="Δημιουργία εφοδίων για τη φάρμα σας"
      buttonChildren={
        <>
          <Button
            onClick={() => reset()}
            type="button"
            variant="outline"
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" form="create-field-form" disabled={isPending}>
            Δημιουργία
          </Button>
        </>
      }
    >
      <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label="Όνομα" />

          <ControlledInput
            control={control}
            name="nickname"
            label="Ψευδώνυμο"
          />

          <ControlledSelect
            control={control}
            name="measurementUnit"
            placeholder="Μονάδα μέτρησης"
            values={[
              { value: "KG", label: "Κιλά" },
              { value: "L", label: "Λίτρα" },
            ]}
          />

          <ControlledSelect
            control={control}
            name="supplyType"
            placeholder="Κατηγορία"
            values={[
              { value: "chemicals", label: "φάρμακά" },
              { value: "fertilizers", label: "λιπάσματα" },
              { value: "seeds", label: "Σπόροι" },
            ]}
          />
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
