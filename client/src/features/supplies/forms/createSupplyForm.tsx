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
import ControllledSelect from "@/components/ControllledSelect";

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
      cardTitle="Create Supplies"
      cardDescription="Create a Supply to manage"
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
            Create Supplies
          </Button>
        </>
      }
    >
      <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label="name" />

          <ControlledInput control={control} name="nickname" label="alias" />

          <ControllledSelect
            control={control}
            name="measurementUnit"
            placeholder="select a unit"
            values={[
              { value: "KG", label: "Kilograms" },
              { value: "L", label: "Litres" },
            ]}
          />

          <ControllledSelect
            control={control}
            name="supplyType"
            placeholder="Select a supply type"
            values={[
              { value: "chemicals", label: "Chemicals" },
              { value: "fertilizers", label: "Fertilizers" },
            ]}
          />
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
