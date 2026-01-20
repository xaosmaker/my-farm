"use client";
import BaseForm from "@/components/BaseForm";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { EmailFormData, emailValidator } from "../validators";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@/components/ControlledInput";
import { useActionState, useTransition } from "react";
import { resendVerifyEmailAction } from "../actions/authActions";
import ServerErrors from "@/components/ServerErrors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export default function ResendVerForm() {
  const { control, handleSubmit } = useForm<EmailFormData>({
    mode: "all",
    resolver: zodResolver(emailValidator),
    defaultValues: {
      email: "",
    },
  });

  const [state, action] = useActionState(resendVerifyEmailAction, undefined);
  const [isPending, startTransition] = useTransition();

  function onFormSubmit(data: EmailFormData) {
    startTransition(() => {
      action(data);
    });
  }

  return (
    <BaseForm
      cardTitle="Resend verification email"
      cardDescription="Resend Verification email for the user"
      buttonChildren={
        <>
          <Button form="resendVerEmail" disabled={isPending}>
            send
          </Button>
        </>
      }
    >
      <form id="resendVerEmail" onSubmit={handleSubmit(onFormSubmit)}>
        <ControlledInput control={control} name="email" label="email" />
        {state?.errors && <ServerErrors errors={state?.errors} />}

        {state?.success && (
          <Alert variant="default" className="mt-10 text-green-500">
            <CheckCircle2Icon />
            <AlertTitle>Token Created</AlertTitle>
            <AlertDescription className="text-green-500">
              Go to your email and follow the instruction
            </AlertDescription>
          </Alert>
        )}
      </form>
    </BaseForm>
  );
}
