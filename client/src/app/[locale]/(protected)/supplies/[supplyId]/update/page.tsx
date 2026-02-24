import CreateSupplyForm from "@/features/supplies/forms/CreateSupplyForm";
import { getAuth } from "@/lib/getAuth";
import { getSupply } from "@/features/supplies/suppliesFetchers";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("updateSupplies"),
  };
}
export default async function UpdateSupplyPage({
  params,
}: {
  params: Promise<{ supplyId: string }>;
}) {
  await getAuth();
  const { supplyId } = await params;
  const supply = await getSupply(supplyId, false);
  return <CreateSupplyForm userSupply={supply} />;
}
