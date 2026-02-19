"use client";
import BaseForm from "@/components/BaseForm";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { createFarmSchema, CreateFarmSchema } from "../farmSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ControlledInput";
import { useActionState, useTransition } from "react";
import { createFarmAction } from "../farmActions";
import ServerError from "@/components/ServerError";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export default function CreateFarmForm() {
  const t = useTranslations("Farm.Create");
  const et = useTranslations("Global.Error");
  const { control, reset, handleSubmit } = useForm<CreateFarmSchema>({
    mode: "onChange",
    resolver: zodResolver(createFarmSchema(et, t("name"))),
    defaultValues: {
      name: "",
    },
  });

  const [state, action] = useActionState(createFarmAction, undefined);
  const [isPending, startTransition] = useTransition();

  function onSubmit(data: CreateFarmSchema) {
    startTransition(() => {
      action(data);
    });
  }
  if (state?.success) {
    signOut();
  }
  return (
    <BaseForm
      submitFormName="create-farm-form"
      formTitle={t("title")}
      formDesc={t("desc")}
      submitButton={t("submitButton")}
      resetForm={reset}
      isPending={isPending}
    >
      <form id="create-farm-form" onSubmit={handleSubmit(onSubmit)}>
        <ControlledInput
          control={control}
          name="name"
          label={t("name")}
          required
        />
        {state?.errors && <ServerError errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
