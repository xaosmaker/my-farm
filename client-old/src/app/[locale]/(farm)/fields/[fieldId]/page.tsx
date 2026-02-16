import DeleteItem from "@/components/DeleteItem";
import EditItem from "@/components/EditItem";
import ShowFieldGroup from "@/components/ShowFieldGroup";
import ShowFieldPage from "@/components/ShowFieldPage";
import ShowFieldsData from "@/components/ShowFieldsData";
import { deleteFieldAction } from "@/features/fields/actions/actions";
import { getFieldById } from "@/features/fields/fieldsFetchers";
import { getAllSeasons } from "@/features/seasons/fetchers";
import SeasonTable from "@/features/seasons/SeasonTable";
import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function FieldPage({
  params,
}: {
  params: Promise<{ fieldId: string }>;
}) {
  const { fieldId } = await params;
  const t = await getTranslations("Fields.Details");
  const field = await getFieldById(fieldId);
  if (!field) {
    return <div>No Field Found</div>;
  }
  const seasons = await getAllSeasons(fieldId);

  return (
    <>
      <ShowFieldPage title={`${t("pageTitle")} ${field.name}`}>
        <ShowFieldGroup groupName={t("details")}>
          <ShowFieldsData
            fieldName={field.landUnit}
            value={field.areaInMeters.toString()}
          />

          <ShowFieldsData
            fieldName={t("owned")}
            value={field.isOwned ? t("yes") : t("no")}
          />
        </ShowFieldGroup>
        <ShowFieldGroup groupName={t("location")}>
          <ShowFieldsData
            fieldName={t("location")}
            value={field.fieldLocation.toString()}
          />

          <Link href={"#"}>
            <MapPin />
          </Link>
        </ShowFieldGroup>
        <ShowFieldGroup
          groupName="Actions"
          className="col-span-full mt-10 gap-1"
        >
          <DeleteItem
            name={field.name}
            formAction={deleteFieldAction}
            id={field.id.toString()}
          />

          <EditItem url={`/fields/${field.id}/edit`} />
        </ShowFieldGroup>
      </ShowFieldPage>
      <SeasonTable fieldId={field.id.toString()} seasonsData={seasons} />
    </>
  );
}
