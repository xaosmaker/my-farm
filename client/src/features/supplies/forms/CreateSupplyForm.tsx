"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { useActionState, useTransition } from "react";
import {
  createSupplyAction,
  updateSupplyAction,
} from "@/features/supplies/suppliesActions";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import ControlledSelect from "@/components/ControlledSelect";
import ServerError from "@/components/ServerError";
import { suppliesSchema, SuppliesSchema } from "../suppliesSchema";
import { useTranslations } from "next-intl";
import { MSupplyType, MUnit, Supply } from "@/types/globalTypes";
import { MEASUREMENT_UNITS, SUPPLIES_TYPES } from "@/lib/globalData";

export default function CreateSupplyForm({
  userSupply,
}: {
  userSupply?: Supply;
}) {
  const et = useTranslations("Global.Error");
  const t = useTranslations(userSupply ? "Supplies.Update" : "Supplies.Create");
  const ut = useTranslations("Units");
  const st = useTranslations("SupplyTypes");
  const { control, reset, handleSubmit } = useForm<SuppliesSchema>({
    mode: "onChange",
    resolver: zodResolver(suppliesSchema(et, t("name"))),
    shouldFocusError: true,
    defaultValues: {
      nickname: userSupply?.nickname || "",
      name: userSupply?.name || "",
      supplyType: userSupply?.supplyType || "",
      measurementUnit: userSupply?.measurementUnit || "",
    },
  });

  const [state, action] = useActionState(
    userSupply ? updateSupplyAction.bind(null, userSupply) : createSupplyAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: SuppliesSchema) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      submitButton={t("submitButton")}
      formTitle={t("title")}
      formDesc={t("desc")}
      submitFormName="create-supply-form"
      isPending={isPending}
      resetForm={reset}
    >
      <form id="create-supply-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput control={control} name="name" label={t("name")} />

          <ControlledInput
            control={control}
            name="nickname"
            label={t("nickname")}
          />

          <ControlledSelect
            control={control}
            name="supplyType"
            label={t("supplyType")}
            ariaLabel={t("supplyType")}
            selectItems={SUPPLIES_TYPES.map((type) => ({
              value: type,
              label: st(type as MSupplyType),
            }))}
          />

          <ControlledSelect
            control={control}
            name="measurementUnit"
            label={t("measurementUnit")}
            ariaLabel={t("measurementUnit")}
            selectItems={MEASUREMENT_UNITS.map((unit) => ({
              value: unit,
              label: ut(unit as MUnit),
            }))}
          />
        </FieldGroup>
        {state?.errors && <ServerError errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
