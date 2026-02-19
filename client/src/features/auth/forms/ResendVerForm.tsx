"use client";
import BaseForm from "@/components/BaseForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ControlledInput";
import { useActionState, useTransition } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ResendVerCodeSchema,
  resendVerCodeSchema,
} from "../schemas/resendVerCodeSchema";
import { resendVerifyEmailAction } from "../authActions";
import ServerError from "@/components/ServerError";

export default function ResendVerForm() {
  const { control, handleSubmit } = useForm<ResendVerCodeSchema>({
    mode: "all",
    resolver: zodResolver(resendVerCodeSchema),
    defaultValues: {
      email: "",
    },
  });

  const [state, action] = useActionState(resendVerifyEmailAction, undefined);
  const [isPending, startTransition] = useTransition();

  function onFormSubmit(data: ResendVerCodeSchema) {
    startTransition(() => {
      action(data);
    });
  }

  const t = useTranslations("Verification");
  return (
    <BaseForm
      formTitle={t("title")}
      formDesc={t("desc")}
      submitFormName="resendVerEmail"
      submitButton={t("submitButton")}
      isPending={isPending}
    >
      <form id="resendVerEmail" onSubmit={handleSubmit(onFormSubmit)}>
        <ControlledInput control={control} name="email" label="email" />
        {state?.errors && <ServerError errors={state?.errors} />}

        {state?.success && (
          <Alert variant="default" className="mt-10 text-green-500">
            <CheckCircle2Icon />
            <AlertTitle>{t("successTitle")}</AlertTitle>
            <AlertDescription className="text-green-500">
              {t("successDesc")}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </BaseForm>
  );
}
