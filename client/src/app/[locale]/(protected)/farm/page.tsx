import H1 from "@/components/H1";
import { getAuth } from "@/lib/getAuth";

export default async function FarmHomePage() {
  await getAuth();

  return (
    <div>
      <H1 className="text-center">Welcome to My farm </H1>;
    </div>
  );
}
