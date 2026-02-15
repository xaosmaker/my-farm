"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function BaseForm({
  children,
  formTitle,
  formDesc,
  submitButton,
  submitFormName,
  resetForm,
}: {
  children: React.ReactNode;
  formTitle: string;
  formDesc: string;
  submitFormName: string;
  submitButton: string;
  resetForm: () => void;
}) {
  const t = useTranslations("Global.Form");
  const router = useRouter();
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
        <CardDescription>{formDesc}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => router.back()}
                aria-label={t("prevPage")}
                variant="ghost"
              >
                <ArrowLeft />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("prevPage")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t("resetForm")}
                onClick={resetForm}
                variant="ghost"
              >
                <RefreshCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("resetForm")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          type="submit"
          form={submitFormName}
          className="bg-green-600 hover:bg-green-500"
        >
          {submitButton}
        </Button>
      </CardFooter>
    </Card>
  );
}
