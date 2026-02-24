import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("field"),
  };
}

export default async function FieldPage() {
  await getAuth();
  return <div>single field page</div>;
}
