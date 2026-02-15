"use client";
import type { Control, Path, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";
import { useTranslations } from "next-intl";

export default function ControlledPasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  required,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const t = useTranslations("Global.Password");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}{" "}
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              aria-invalid={fieldState.invalid}
              id={name}
              {...field}
              type={showPassword ? "text" : "password"}
              required={required}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    onClick={() => setShowPassword((val) => !val)}
                    aria-label={
                      showPassword ? "hide password" : "show password"
                    }
                    type="button"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  {showPassword ? t("hidePass") : t("showPass")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
