"use client";
import BaseForm from "@/components/BaseForm";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { FarmFormData, farmValidators } from "@/features/farm/farmValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import { CreateFarmAction } from "../actions/CreateFarmAction";
import ControlledInput from "@/components/ControlledInput";

export default function CreateFarmForm() {
  const { control, handleSubmit } = useForm<FarmFormData>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(farmValidators),
    mode: "onChange",
  });

  const [_, action] = useActionState(CreateFarmAction, undefined);
  const [isPending, startTransition] = useTransition();
  function farmSubmit(data: FarmFormData) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      cardDescription="Create your farm"
      cardTitle="Create Farm"
      buttonChildren={
        <>
          <Button type="reset" variant="ghost" disabled={isPending}>
            Reset
          </Button>
          <Button form="create-farm-form" disabled={isPending}>
            Submit
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(farmSubmit)} id="create-farm-form">
        <FieldGroup>
          <ControlledInput control={control} name="name" label="Farm Name" />
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
