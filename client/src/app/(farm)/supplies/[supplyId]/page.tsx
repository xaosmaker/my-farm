import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
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
        <ShowFieldsData fieldName="name">{supply.name}</ShowFieldsData>
        {supply.nickname && (
          <ShowFieldsData fieldName="Nickname">
            {supply.nickname}
          </ShowFieldsData>
        )}
      </ShowFieldGroup>
      <ShowFieldGroup groupName="details">
        <ShowFieldsData fieldName="unit">
          {engToGreek.get(supply.measurementUnit) || supply.measurementUnit}
        </ShowFieldsData>
        <ShowFieldsData fieldName="Type">
          {engToGreek.get(supply.supplyType) || supply.supplyType}
        </ShowFieldsData>
      </ShowFieldGroup>
    </ShowFieldPage>
  );
}
