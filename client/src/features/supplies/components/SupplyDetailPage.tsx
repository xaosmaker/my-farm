"use client";

import DetailPage from "@/components/DetailPage";
import { DetailCard } from "@/components/DetailCard";
import { DetailRow } from "@/components/DetailRow";
import { Calendar, Clock, Package, Scale } from "lucide-react";
import { Supply } from "@/types/globalTypes";
import { useTranslations } from "next-intl";
import DeleteItem from "@/components/DeleteItem";
import UpdateItem from "@/components/UpdateItem";
import { deleteSupplyAction } from "../suppliesActions";

export default function SupplyDetailPage({ supply }: { supply: Supply }) {
  const t = useTranslations("Supplies.Table");
  const dpt = useTranslations("DetailPage");
  return (
    <DetailPage title={supply.name}>
      <DetailCard title={dpt("info")} icon={Package}>
        <DetailRow icon={Package} label={t("name")} value={supply.name} />
        <DetailRow label={t("nickname")} value={supply.nickname || "-"} />
        <DetailRow label={t("supplyType")} value={supply.supplyType} />
        <DetailRow
          label={t("measurementUnit")}
          value={supply.measurementUnit}
          icon={Scale}
        />
      </DetailCard>

      <DetailCard title={dpt("systemInfo")} icon={Clock}>
        <DetailRow
          label={dpt("createdAt")}
          value={supply.createdAt}
          icon={Calendar}
        />
        <DetailRow
          label={dpt("updatedAt")}
          value={supply.updatedAt}
          icon={Clock}
        />
      </DetailCard>
      <DetailCard title="Actions">
        <UpdateItem label={supply.name} href={`/supplies/${supply.id}/update`} />
        <DeleteItem
          label={supply.name}
          formAction={deleteSupplyAction}
          id={supply.id.toString()}
          redirectPath="/supplies"
        />
      </DetailCard>
    </DetailPage>
  );
}
