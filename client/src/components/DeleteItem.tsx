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

export default function DeleteItem({
  id,
  name,
  formAction,
}: {
  id: string;
  name: string;
  formAction: (state: undefined, id: string) => Promise<undefined>;
}) {
  const [_, action] = useActionState(formAction, undefined);
  const [isPending, startTransition] = useTransition();
  function onSubmit() {
    startTransition(() => {
      action(id);
    });
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex gap-2 text-red-500">
        <Trash2 />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Are you sure you want to delete {name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-500">
            This action is ireversible! Do you want to continue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Close</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={onSubmit}
            className="bg-red-500 text-neutral-50"
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
