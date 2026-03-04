import SeasonDetailPage from "@/features/seasons/components/SeasonDetailPage";
import { getSeason } from "@/features/seasons/seasonFetchers";
import { getJobs } from "@/features/jobs/jobsFetchers";
import { getAuth } from "@/lib/getAuth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import JobsTable from "@/features/jobs/JobsTable";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("seasons"),
  };
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ seasonId: string }>;
}) {
  const session = await getAuth();
  const { seasonId } = await params;
  const season = await getSeason(seasonId, session.user!.intl);
  // const jobs = await getJobs(seasonId, true, session.user!.intl);
  const jobs = await getJobs(seasonId, true, session.user!.intl);

  return (
    <div className="flex flex-col gap-10">
      <SeasonDetailPage season={season} />
      <JobsTable jobs={jobs} seasonId={parseInt(seasonId)} />
    </div>
  );
}
