import H1 from "@/components/H1";
import { getFields } from "@/features/fields/fieldFetchers";
import FieldTable from "@/features/fields/FieldTable";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("field"),
  };
}

export default async function FieldsPage() {
  const fields = await getFields();
  const t = await getTranslations("Fields");
  return (
    <>
      <H1 className="mb-10 text-center capitalize">{t("pageTitle")}</H1>
      <FieldTable fieldData={fields} />
    </>
  );
}
