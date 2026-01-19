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
  function onSubmit() {
    startTransition(() => {
      action(id);
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex gap-2 rounded-xl p-2 text-red-500 hover:bg-current/10">
        <Trash2 />
        Διαγραφή
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Είσαι σίγουρος ότι θες να διαγράψεις &apos;{name}&apos;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            Αυτή η διαδικασία είναι μόνιμή! Θες αν συνεχίσεις?
          </AlertDialogDescription>
        </AlertDialogHeader>
        {state && <ServerErrors errors={state} />}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Ακύρωσή</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={onSubmit}
            className="bg-red-500 text-neutral-50"
          >
            Διαγραφή
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
