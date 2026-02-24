"use client";

import DetailPage from "@/components/DetailPage";
import { DetailCard } from "@/components/DetailCard";
import { DetailRow } from "@/components/DetailRow";
import { Calendar, Clock, MapPin, Ruler, SquareKanban } from "lucide-react";
import { Field } from "../fieldTypes";
import { useTranslations } from "next-intl";
import { MUnit, UserSettings } from "@/types/globalTypes";
import DeleteItem from "@/components/DeleteItem";
import UpdateItem from "@/components/UpdateItem";
import { deleteFieldAction } from "../fieldActions";

export default function FieldDetailPage({
  field,
  userSetting,
}: {
  field: Field;
  userSetting: UserSettings;
}) {
  const t = useTranslations("Fields.Table");
  const ut = useTranslations("Units");
  const dpt = useTranslations("DetailPage");
  return (
    <DetailPage title={field.name}>
      <DetailCard title={dpt("info")} icon={MapPin}>
        <DetailRow icon={SquareKanban} label={t("name")} value={field.name} />
        <DetailRow
          label={ut(userSetting.landUnit as MUnit)}
          value={field.areaInMeters}
          icon={Ruler}
        />
        <DetailRow
          label={t("fieldLocation")}
          value={field.fieldLocation}
          icon={MapPin}
        />
        <DetailRow
          label={t("isOwned")}
          value={
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                field.isOwned === "Owned"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
              }`}
            >
              {field.isOwned}
            </span>
          }
        />
      </DetailCard>

      <DetailCard title={dpt("systemInfo")} icon={Clock}>
        <DetailRow
          label={dpt("createdAt")}
          value={field.createdAt}
          icon={Calendar}
        />
        <DetailRow
          label={dpt("updatedAt")}
          value={field.updatedAt}
          icon={Clock}
        />
      </DetailCard>
      <DetailCard title="Actions">
        <UpdateItem label={field.name} href={`/fields/${field.id}/update`} />
        <DeleteItem
          label={field.name}
          formAction={deleteFieldAction}
          id={field.id.toString()}
          redirectPath="/fields"
        />
      </DetailCard>
    </DetailPage>
  );
}
