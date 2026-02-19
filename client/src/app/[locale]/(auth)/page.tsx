import H1 from "@/components/H1";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("home"),
  };
}
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
