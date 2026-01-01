"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { LoginFormData, loginValidate } from "../validators";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import BaseForm from "@/components/BaseForm";
import ControlledInput from "@/components/ControlledInput";

export default function LoginForm() {
  const { control, reset, handleSubmit, formState } = useForm<LoginFormData>({
    mode: "onChange",
    resolver: zodResolver(loginValidate),
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  async function onSubmit(data: LoginFormData) {
    await signIn("credentials", data);
  }

  return (
    <BaseForm
      cardTitle="My Farm Login"
      cardDescription="Login to your My Farm account"
      buttonChildren={
        <>
          <Button
            disabled={formState.isSubmitting}
            onClick={() => reset()}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="login-form"
            disabled={formState.isSubmitting}
          >
            Login
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
            label="email"
          />
          <Controller
            control={control}
            name="password"
            render={({ fieldState, field }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>

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
                      title="Show password"
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
        </FieldGroup>
      </form>
    </BaseForm>
  );
}
