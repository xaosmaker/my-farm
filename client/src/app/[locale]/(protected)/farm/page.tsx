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
// Great! A dashboard for a farm management system. Here are some ideas:
//
//      Option 1: Stats Cards
//      - Total Fields count
//      - Total Area (sum of all fields)
//      - Active Seasons (currently running)
//      - Total Supplies
//
//      Option 2: Farm Info + Quick Actions
//      - Farm name card
//      - Quick links: Add Field, Add Season, Add Supply
//      - Recent items
//
//      Option 3: Full Dashboard
//      - Stats cards row
//      - Farm info card
//      - Active seasons overview
//      - Recent fields list
//
