import { getAllFields } from "@/features/fields/fieldsFetchers";
import ShowH1 from "@/components/ShowH1";
import { FieldsTable } from "@/features/fields/FieldsTable";
import { getTranslations } from "next-intl/server";

export default async function FieldsPages() {
  const fields = await getAllFields();
  const t = await getTranslations("Fields");

  return (
    <>
      <ShowH1>{t("pageTitle")}</ShowH1>
      <FieldsTable fieldsData={fields} />
    </>
  );
}
