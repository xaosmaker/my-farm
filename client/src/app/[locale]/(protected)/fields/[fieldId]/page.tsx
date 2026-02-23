import { getAuth } from "@/lib/getAuth";

export default async function FieldPage() {
  await getAuth();
  return <div>single field page</div>;
}
