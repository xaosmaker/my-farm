"use client";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RegFormData, registerValidate } from "../validators";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import { useActionState, useState, useTransition } from "react";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";
import { createUserAction } from "../actions/authActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { CardAction } from "@/components/ui/card";
import Link from "next/link";

export default function RegForm() {
  const { control, reset, handleSubmit } = useForm<RegFormData>({
    mode: "onChange",
    resolver: zodResolver(registerValidate),
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCPassword, setShowCPassword] = useState<boolean>(false);
  const [state, action] = useActionState(createUserAction, undefined);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Register");

  function onSubmit(data: RegFormData) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      cardAction={
        <CardAction className="p-2">
          <Link href="/login">{t("loginLink")}</Link>
        </CardAction>
      }
      cardTitle={t("title")}
      cardDescription={t("desc")}
      buttonChildren={
        <>
          <Button
            disabled={isPending}
            onClick={() => reset()}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
          <Button type="submit" form="login-form" disabled={isPending}>
            {t("button")}
          </Button>
        </>
      }
    >
      <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <ControlledInput
            control={control}
            name="email"
            type="email"
            label={t("email")}
          />
          <Controller
            control={control}
            name="password"
            render={({ fieldState, field }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="password"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Show password"
                      title={t("showPassword")}
                      size="icon-xs"
                      onClick={() => {
                        setShowPassword((b) => !b);
                      }}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ fieldState, field }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  {t("password2")}
                </FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    type={showCPassword ? "text" : "password"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="confirmPassword"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Show password"
                      title={t("showPassword")}
                      size="icon-xs"
                      onClick={() => {
                        setShowCPassword((b) => !b);
                      }}
                    >
                      {showCPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
        {state?.errors && <FieldError className="pt-2" errors={state.errors} />}
      </form>
    </BaseForm>
  );
}
