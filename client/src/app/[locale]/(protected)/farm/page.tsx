import H1 from "@/components/H1";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("dashboard"),
  };
}
export default async function FarmHomePage() {
  await getAuth();

  return (
    <div>
      <H1 className="text-center">Welcome to My farm </H1>
    </div>
  );
}
