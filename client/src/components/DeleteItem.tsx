import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useActionState, useTransition } from "react";
import { redirect } from "next/navigation";
import { FieldError } from "./ui/field";
import { useTranslations } from "next-intl";
export default function DeleteItem({
  formAction,
  id,
  label,
}: {
  label: string;
  formAction: (
    state: unknown,
    id: string,
  ) => Promise<{
    success: boolean;
    errors: Array<{ message?: string } | undefined> | undefined;
  }>;
  id: string;
}) {
  const t = useTranslations("DeleteComponent");
  const [state, action] = useActionState(formAction, undefined);
  const [isPending, startTransition] = useTransition();
  function onSubmit() {
    startTransition(() => {
      action(id);
    });
  }
  if (state?.success) {
    return redirect("/fields");
  }
  return (
    <Dialog>
      <DialogTrigger asChild className="flex gap-2">
        <Button variant="ghost" className="w-full">
          <Trash2 /> {t("delete", { name: label })}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-500">
            {t("deleteTitle", { name: label })}
          </DialogTitle>
          <DialogDescription>{t("deleteDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button type="reset" variant="outline" disabled={isPending}>
              {t("cancelButton")}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            type="submit"
            disabled={isPending}
            onClick={onSubmit}
          >
            {t("confirmButton")}
          </Button>
        </div>
        {state?.errors && <FieldError errors={state?.errors} />}
      </DialogContent>
    </Dialog>
  );
}
