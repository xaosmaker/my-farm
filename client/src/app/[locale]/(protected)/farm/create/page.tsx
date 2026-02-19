import CreateFarmForm from "@/features/farm/forms/CreateFarmForm";
import { getAuth } from "@/lib/getAuth";
import { redirect } from "next/navigation";

export default async function CreateFarmPage() {
  const session = await getAuth();
  if (session.user?.farmId) {
    redirect("/farm");
  }
  return <CreateFarmForm />;
}
