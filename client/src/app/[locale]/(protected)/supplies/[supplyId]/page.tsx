import SupplyDetailPage from "@/features/supplies/components/SupplyDetailPage";
import { getSupply } from "@/features/supplies/suppliesFetchers";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("supplies"),
  };
}

export default async function SupplyPage({
  params,
}: {
  params: Promise<{ supplyId: string }>;
}) {
  const session = await getAuth();
  const { supplyId } = await params;
  const supply = await getSupply(supplyId, true, session.user!.intl);

  return <SupplyDetailPage supply={supply} />;
}
