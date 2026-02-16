import H1 from "@/components/H1";
import { getAuth } from "@/lib/getAuth";

export default async function Home() {
  await getAuth();
  return (
    <section>
      <H1 className="text-center">Home Page</H1>
    </section>
  );
}
