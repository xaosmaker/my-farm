import ShowH1 from "@/components/ShowH1";
import { getAllSupplies } from "@/features/supplies/getters";
import SuppliesTable from "@/features/supplies/SuppliesTable";
import { getTranslations } from "next-intl/server";

export default async function SuppliesPage() {
  const t = await getTranslations("Supplies");
  const supplies = await getAllSupplies(true);

  return (
    <>
      <ShowH1>{t("pageTitle")}</ShowH1>
      <SuppliesTable suppliesData={supplies} />
    </>
  );
}
