import CreateJobForm from "@/features/jobs/forms/CreateJobForm";
import { getSeason } from "@/features/seasons/seasonFetchers";
import { getSupplies } from "@/features/supplies/suppliesFetchers";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("createJob"),
  };
}

export default async function CreateJobPage({
  params,
}: {
  params: Promise<{ seasonId: string }>;
}) {
  const { seasonId } = await params;
  const session = await getAuth();
  const season = await getSeason(seasonId, session.user!.intl);
  const supplies = await getSupplies();

  return <CreateJobForm season={season} supplies={supplies} />;
}
