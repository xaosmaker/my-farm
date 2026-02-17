"use client";

import { FieldError, FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ControlledInput";
import ControlledPasswordInput from "@/components/ControlledPasswordInput";
import BaseForm from "@/components/BaseForm";
import { useTranslations } from "next-intl";

export default function RegisterForm() {
  const et = useTranslations("Global.Error");
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema(et)),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const t = useTranslations("RegisterForm");

  async function onSubmit(data: LoginSchema) {
    console.log(data);
  }

  return (
    <BaseForm
      formTitle={t("title")}
      formDesc={t("desc")}
      submitButton={t("submitButton")}
      resetForm={reset}
      submitFormName="login-form"
    >
      <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput
            control={control}
            name="email"
            label="Email"
            type="email"
            required
          />
          <ControlledPasswordInput
            control={control}
            name="password"
            label={t("password")}
            required
          />
        </FieldGroup>
        {errors.root && <FieldError className="mt-5" errors={[errors.root]} />}
      </form>
    </BaseForm>
  );
}
