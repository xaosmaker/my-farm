import CreateFarmForm from "@/features/farm/forms/CreateFarmForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateFarmPage() {
  const session = await auth();

  if (session?.user?.farmId) {
    redirect("/fields");
  }
  return <CreateFarmForm />;
}
