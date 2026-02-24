"use client";

import DetailPage from "@/components/DetailPage";
import { DetailCard } from "@/components/DetailCard";
import { DetailRow } from "@/components/DetailRow";
import { Calendar, Clock, Leaf, MapPin, Ruler } from "lucide-react";
import { Season } from "@/types/globalTypes";
import { useTranslations } from "next-intl";
import DeleteItem from "@/components/DeleteItem";
import UpdateItem from "@/components/UpdateItem";
import { deleteSeasonAction } from "../seasonActions";
import Link from "next/link";

export default function SeasonDetailPage({ season }: { season: Season }) {
  const t = useTranslations("Seasons.Table");
  const dpt = useTranslations("DetailPage");
  return (
    <DetailPage title={season.name}>
      <DetailCard title={dpt("info")} icon={Leaf}>
        <DetailRow label={t("name")} value={season.name} />
        <DetailRow
          label={t("fieldName")}
          value={
            <Link
              href={`/fields/${season.fieldId}`}
              className="hover:underline"
            >
              {season.fieldName}
            </Link>
          }
          icon={MapPin}
        />
        <DetailRow label={t("cropName")} value={season.cropName} icon={Leaf} />
        <DetailRow
          label={t("startSeason")}
          value={season.startSeason}
          icon={Calendar}
        />
        <DetailRow
          label={t("finishSeason")}
          value={season.finishSeason || "-"}
          icon={Calendar}
        />
        <DetailRow
          label={t("areaInMeters")}
          value={`${season.areaInMeters} ${season.landUnit}`}
          icon={Ruler}
        />
      </DetailCard>

      <DetailCard title={dpt("systemInfo")} icon={Clock}>
        <DetailRow
          label={dpt("createdAt")}
          value={season.createdAt}
          icon={Calendar}
        />
        <DetailRow
          label={dpt("updatedAt")}
          value={season.updatedAt}
          icon={Clock}
        />
      </DetailCard>
      <DetailCard title="Actions">
        <UpdateItem
          label={season.name}
          href={`/fields/${season.fieldId}/seasons/${season.id}/update`}
        />
        <DeleteItem
          label={season.name}
          formAction={deleteSeasonAction}
          id={season.id.toString()}
          redirectPath="/seasons"
        />
      </DetailCard>
    </DetailPage>
  );
}
