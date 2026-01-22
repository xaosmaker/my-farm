import DeleteItem from "@/components/DeleteItem";
import EditItem from "@/components/EditItem";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import { deleteSupplyAction } from "@/features/supplies/actions/createSuppliesActions";
import { getSupplyById } from "@/features/supplies/getters";
import { getTranslations } from "next-intl/server";

export default async function SupplyPage({
  params,
}: {
  params: Promise<{ supplyId: string }>;
}) {
  const { supplyId } = await params;
  const supplies = await getSupplyById(supplyId, true);
  if (supplies.length !== 1) {
    return <div>No Supply found</div>;
  }
  const supply = supplies[0];
  const t = await getTranslations("Supplies.Page");

  return (
    <ShowFieldPage title={`${supply.name} ${supply.supplyType}`}>
      <ShowFieldGroup groupName={t("details")}>
        <ShowFieldsData
          fieldName={t("measurementUnit")}
          value={supply.measurementUnit}
        />
      </ShowFieldGroup>
      <ShowFieldGroup groupName="Actions" className="col-span-full">
        <DeleteItem
          id={supply.id.toString()}
          name={supply.name}
          formAction={deleteSupplyAction}
        />
        <EditItem url={`/supplies/${supply.id}/update`} />
      </ShowFieldGroup>
    </ShowFieldPage>
  );
}
