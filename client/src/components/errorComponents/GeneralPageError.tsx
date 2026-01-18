"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, ArrowLeft } from "lucide-react";

export default function GeneralPageError({
  title,
  error,
}: {
  title: string;
  error: Error & { diggest?: string };
}) {
  const router = useRouter();
  return (
    <div className="text-center">
      <Alert variant="destructive" className="mx-auto max-w-md">
        <AlertTitle className="flex items-center justify-center gap-4 text-lg">
          <AlertCircleIcon />
          Something went wrong in {title}
        </AlertTitle>
        <AlertDescription className="flex flex-col items-center justify-center">
          <p>{error.message}</p>
          <div>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft />
            </Button>
            <Button variant="secondary" onClick={() => router.refresh()}>
              Refresh Page
            </Button>
          </div>
          <p className="pt-4">If the error persist contact the admin</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
