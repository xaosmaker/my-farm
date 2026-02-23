import H1 from "@/components/H1";
import { getSupplies } from "@/features/supplies/suppliesFetchers";
import SuppliesTable from "@/features/supplies/SuppliesTable";
import { getAuth } from "@/lib/getAuth";
import { getTranslations } from "next-intl/server";

export default async function SuppliesPage() {
  await getAuth();
  const supplies = await getSupplies();
  const t = await getTranslations("Global.metaData");

  return (
    <>
      <H1 className="mb-10 text-center">{t("supplies")}</H1>
      <SuppliesTable supplyData={supplies} />
    </>
  );
}
