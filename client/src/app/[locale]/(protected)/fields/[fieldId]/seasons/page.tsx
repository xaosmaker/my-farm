import H1 from "@/components/H1";
import { getField } from "@/features/fields/fieldFetchers";
import { getSeasonsByFieldId } from "@/features/seasons/seasonFetchers";
import SeasonsTable from "@/features/seasons/SeasonsTable";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}): Promise<Metadata> {
  const { fieldId } = await params;
  const field = await getField(fieldId);
  const t = await getTranslations("Global.metaData");
  return {
    title: `${t("seasons")} ${field.name}`,
  };
}
export default async function FieldSeasonsPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const session = await getAuth();
  const { fieldId } = await params;
  const seasonsData = await getSeasonsByFieldId(fieldId, session.user!.intl);
  const field = await getField(fieldId);
  const t = await getTranslations("Global.metaData");

  return (
    <>
      <H1 className="mb-10 text-center">
        {t("seasons")} {field.name}
      </H1>
      <SeasonsTable seasonData={seasonsData} fieldId={fieldId} />
    </>
  );
}
