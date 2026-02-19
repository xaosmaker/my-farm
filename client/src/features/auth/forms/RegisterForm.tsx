"use client";

import { FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ControlledInput";
import ControlledPasswordInput from "@/components/ControlledPasswordInput";
import BaseForm from "@/components/BaseForm";
import { useTranslations } from "next-intl";
import { registerSchema, RegisterSchema } from "../schemas/registerSchema";
import { useActionState, useTransition } from "react";
import { registerAction } from "../authActions";
import ServerError from "@/components/ServerError";
import { toast } from "sonner";
import { CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function RegisterForm() {
  const et = useTranslations("Global.Error");
  const { control, reset, handleSubmit } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema(et)),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const t = useTranslations("RegisterForm");
  const [state, action] = useActionState(registerAction, undefined);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(data: RegisterSchema) {
    startTransition(() => {
      action(data);
    });
  }
  if (state?.success) {
    toast.success(t("successTitle"));
  }

  return (
    <BaseForm
      formTitle={t("title")}
      formDesc={t("desc")}
      submitButton={t("submitButton")}
      resetForm={reset}
      submitFormName="login-form"
      isPending={isPending}
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
          <ControlledPasswordInput
            control={control}
            name="confirmPassword"
            label={t("confirmPassword")}
            required
          />
        </FieldGroup>

        {state?.success && (
          <Alert variant="default" className="mt-10 text-green-500">
            <CheckCircle2Icon />
            <AlertTitle>{t("successTitle")}</AlertTitle>
            <AlertDescription className="text-green-500">
              {t("successDesc")}
            </AlertDescription>
          </Alert>
        )}
        <ServerError errors={state?.errors} />

        <div className="mt-5 flex gap-2 text-xs">
          {t("hasAccount")}
          <Link className="text-blue-500" href="/login">
            {t("login")}
          </Link>
        </div>
      </form>
    </BaseForm>
  );
}
