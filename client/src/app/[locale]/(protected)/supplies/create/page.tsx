import CreateSupplyForm from "@/features/supplies/forms/CreateSupplyForm";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("createSupplies"),
  };
}

export default async function CreateSupplyPage() {
  await getAuth();
  return <CreateSupplyForm />;
}
