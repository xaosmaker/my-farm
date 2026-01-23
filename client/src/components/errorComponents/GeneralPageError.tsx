"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GeneralPageError({
  title,
  error,
}: {
  title: string;
  error: Error & { diggest?: string };
}) {
  const router = useRouter();
  const t = useTranslations("PageError");
  return (
    <div className="text-center">
      <Alert variant="destructive" className="mx-auto max-w-md">
        <AlertTitle className="flex items-center justify-center gap-4 text-lg">
          <AlertCircleIcon />
          {t("title")} &apos;{title}&apos;
        </AlertTitle>
        <AlertDescription className="flex flex-col items-center justify-center">
          <p>{error.message}</p>
          <div>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft />
            </Button>
            <Button variant="secondary" onClick={() => router.refresh()}>
              {t("refreshButton")}
            </Button>
          </div>
          <p className="pt-4">{t("footer")}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
