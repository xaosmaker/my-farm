"use client";

import { FieldError, FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ControlledInput";
import ControlledPasswordInput from "@/components/ControlledPasswordInput";
import BaseForm from "@/components/BaseForm";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const et = useTranslations("Global.Error");
  const t = useTranslations("LoginForm");
  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema(et)),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    //TODO: temp fix before refactor the server
    const intl = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      intl,
    });

    if (res?.error) {
      setError("root", { message: et("wrongCred") });
      return;
    }
    router.push("/farm");
    return;
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
        <div className="mt-5 flex gap-2 text-xs">
          {t("hasAccount")}
          <Link className="text-blue-500" href="/register">
            {t("signUp")}
          </Link>
        </div>
      </form>
    </BaseForm>
  );
}
