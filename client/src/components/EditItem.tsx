import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function EditItem({ url }: { url: string }) {
  const t = useTranslations("EditComponent");
  return (
    <Link href={url} className="flex gap-2 rounded-xl p-2 hover:bg-current/10">
      <Pencil /> {t("edit")}
    </Link>
  );
}
