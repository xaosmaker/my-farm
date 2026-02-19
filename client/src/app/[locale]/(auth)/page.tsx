import H1 from "@/components/H1";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/farm");
  }
  return (
    <section>
      <H1 className="text-center">Home Page</H1>
    </section>
  );
}
