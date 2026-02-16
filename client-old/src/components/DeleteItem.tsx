"use client";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useActionState, useTransition } from "react";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import ServerErrors from "./ServerErrors";
import { ResponseError } from "@/lib/responseError";
import { useTranslations } from "next-intl";

export default function DeleteItem({
  id,
  name,
  formAction,
}: {
  id: string;
  name: string;
  formAction: (
    state: ResponseError[] | undefined,
    id: string,
  ) => Promise<ResponseError[] | undefined>;
}) {
  const [state, action] = useActionState(formAction, undefined);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("DeleteComponent");
  function onSubmit() {
    startTransition(() => {
      action(id);
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex gap-2 rounded-xl p-2 text-red-500 hover:bg-current/10">
        <Trash2 />

        {t("delete")}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            {t("deleteTitle")} &apos;{name}&apos;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            {t("deleteDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {state && <ServerErrors errors={state} />}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("cancelButton")}
          </AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={onSubmit}
            className="bg-red-500 text-neutral-50"
          >
            {t("confirmButton")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
