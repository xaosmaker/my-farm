import DeleteItem from "@/components/DeleteItem";
import EditItem from "@/components/EditItem";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import { deleteSupplyAction } from "@/features/supplies/actions/createSuppliesActions";
import { getSupplyById } from "@/features/supplies/getters";
import { engToGreek } from "@/lib/translateMap";

export default async function SupplyPage({
  params,
}: {
  params: Promise<{ supplyId: string }>;
}) {
  const { supplyId } = await params;
  const supplies = await getSupplyById(supplyId);
  if (supplies.length !== 1) {
    return <div>No Supply found</div>;
  }
  const supply = supplies[0];

  return (
    <ShowFieldPage title={supply.name}>
      <ShowFieldGroup groupName="Name">
        <ShowFieldsData fieldName="Όνομα" value={supply.name} />
        {supply.nickname && (
          <ShowFieldsData fieldName="Ψευδώνυμο" value={supply.nickname} />
        )}
      </ShowFieldGroup>
      <ShowFieldGroup groupName="details">
        <ShowFieldsData
          fieldName="Μονάδα μέτρησης"
          value={
            engToGreek.get(supply.measurementUnit) || supply.measurementUnit
          }
        />
        <ShowFieldsData
          fieldName="Type"
          value={engToGreek.get(supply.supplyType) || supply.supplyType}
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
