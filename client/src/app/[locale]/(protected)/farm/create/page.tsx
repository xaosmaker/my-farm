import CreateFarmForm from "@/features/farm/forms/CreateFarmForm";
import { getAuth } from "@/lib/getAuth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("createFarm"),
  };
}

export default async function CreateFarmPage() {
  const session = await getAuth();
  if (session.user?.farmId) {
    redirect("/farm");
  }
  return <CreateFarmForm />;
}
