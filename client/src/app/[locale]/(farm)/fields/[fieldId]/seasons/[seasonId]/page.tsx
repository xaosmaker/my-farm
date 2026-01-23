import { DataTable } from "@/components/data-table";
import DeleteItem from "@/components/DeleteItem";
import EditItem from "@/components/EditItem";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import ShowFieldsDate from "@/components/ShowFieldsDate";
import { GetAllJobs } from "@/features/jobs/jobsFetchers";
import { jobsTable } from "@/features/jobs/jobsTable";
import { deleteSeasonAction } from "@/features/seasons/actions/seasonActions";
import {
  getSeasonById,
  getSeasonStatistics,
} from "@/features/seasons/fetchers";
import { getTranslations } from "next-intl/server";

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ fieldId: string; seasonId: string }>;
}) {
  const { seasonId, fieldId } = await params;
  const seasonStatistics = await getSeasonStatistics(seasonId);
  const t = await getTranslations("Seasons.Page");

  const jobs = await GetAllJobs(seasonId);
  const season = await getSeasonById(fieldId, seasonId, true);
  if (!season) {
    return <div>{t("notFound")}</div>;
  }
  return (
    <>
      <ShowFieldPage title={`${t("pageTitle")} ${season.fieldName}`}>
        <ShowFieldGroup groupName={t("details")}>
          <ShowFieldsData fieldName={t("cropType")} value={season.cropName} />
          <ShowFieldsData
            fieldName={t("areaUsed")}
            value={`${season.areaInMeters.toString()} / ${season.fieldAreaInMeters.toString()} ${season.landUnit}`}
          />
          <ShowFieldsDate
            fieldName={t("startSeason")}
            value={season.startSeason}
          />

          <ShowFieldsDate
            fieldName={t("finishSeason")}
            value={season.finishSeason}
          />
        </ShowFieldGroup>
        <ShowFieldGroup groupName="Στατιστικά">
          {seasonStatistics.length
            ? seasonStatistics.map((stat) => (
                <ShowFieldsData
                  key={stat.supplyId}
                  fieldName={stat.supplyName}
                  value={`Χρησιμοποιήθηκαν: ${stat.totalQuantity} ${stat.harvestQuantity ? "μαζεύτηκαν: " + stat.harvestQuantity : ""} ${stat.measurementUnit}`}
                />
              ))
            : "No statistics available"}
        </ShowFieldGroup>
        <ShowFieldGroup groupName="Actions" className="col-span-full">
          <DeleteItem
            id={season.id.toString()}
            name={season.name}
            formAction={deleteSeasonAction}
          />
          <EditItem url={`/fields/${fieldId}/seasons/${season.id}/update`} />
        </ShowFieldGroup>
      </ShowFieldPage>
      <DataTable
        formId={`${fieldId},${season.id}`}
        columns={jobsTable}
        data={jobs}
        showColumns={{ description: false, id: false }}
      />
    </>
  );
}
