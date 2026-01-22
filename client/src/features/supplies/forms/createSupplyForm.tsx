"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { SuppliesRequest, suppliesValidator } from "../validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useTransition } from "react";
import {
  createSupplyAction,
  updateSupplyAction,
} from "../actions/createSuppliesActions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ControlledSelect from "@/components/ControlledSelect";
import { MEASUREMENT_UNITS, SUPPLIES_TYPES, Supply } from "@/types/sharedTypes";
import { useTranslations } from "next-intl";

export default function CreateSupplyForm({ supply }: { supply?: Supply }) {
  console.log(supply);
  const { control, reset, handleSubmit, formState } = useForm<SuppliesRequest>({
    mode: "onChange",
    resolver: zodResolver(suppliesValidator),
    shouldFocusError: true,
    defaultValues: {
      name: supply?.name || "",
      nickname: supply?.nickname || "",
      supplyType: supply?.supplyType || "",
      measurementUnit: supply?.measurementUnit || "",
    },
  });
  const [_, action] = useActionState(
    supply ? updateSupplyAction : createSupplyAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();
  const dirty = formState.dirtyFields;

  const t = useTranslations(
    supply ? "Supplies.Form.Update" : "Supplies.Form.Create",
  );
  const tr = useTranslations("Supplies.Response");

  function onSubmit(data: SuppliesRequest) {
    let sendData: { [key: string]: unknown } = {};
    if (supply) {
      sendData["id"] = supply.id;
      for (const key in dirty) {
        const k = key as keyof SuppliesRequest;
        sendData[key] = data[k];
      }
    } else {
      sendData = { ...(data as object) };
    }

    startTransition(() => {
      action(sendData);
    });
  }
  return (
    <BaseForm
      cardTitle={t("title")}
      cardDescription={t("desc")}
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
            {t("submitButton")}
          </Button>
        </>
      }
    >
      <form id="create-field-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label={t("name")} />

          <ControlledInput
            control={control}
            name="nickname"
            label={t("nickname")}
          />

          <ControlledSelect
            control={control}
            name="measurementUnit"
            placeholder={t("measurementUnit")}
            values={MEASUREMENT_UNITS.map((item) => ({
              value: item,
              label: tr(item),
            }))}
          />

          <ControlledSelect
            control={control}
            name="supplyType"
            placeholder={t("supplyType")}
            values={SUPPLIES_TYPES.map((item) => ({
              value: item,
              label: tr(item) || item,
            }))}
          />
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
