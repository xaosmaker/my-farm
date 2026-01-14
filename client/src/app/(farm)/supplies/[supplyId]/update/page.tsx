import CreateSupplyForm from "@/features/supplies/forms/createSupplyForm";
import { getSupplyById } from "@/features/supplies/getters";

export default async function UpdateSupplyPage({
  params,
}: {
  params: Promise<{ supplyId: string }>;
}) {
  const { supplyId } = await params;
  const supply = await getSupplyById(supplyId);
  return <CreateSupplyForm supply={supply[0]} />;
}
