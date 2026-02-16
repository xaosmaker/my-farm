"use client";

import GeneralPageError from "@/components/errorComponents/GeneralPageError";
import { useTranslations } from "next-intl";

export default function FieldsError({ error }: { error: Error }) {
  const t = useTranslations("Seasons");
  return <GeneralPageError error={error} title={t("pageTitle")} />;
}
