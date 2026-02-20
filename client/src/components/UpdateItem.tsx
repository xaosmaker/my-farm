import { Pencil } from "lucide-react";

import Link from "next/link";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export default function UpdateItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const t = useTranslations("UpdateItem");
  return (
    <Link className="flex items-center gap-2" href={href}>
      <Button className="w-full" variant="ghost">
        <Pencil /> {t("label", { name: label })}
      </Button>
    </Link>
  );
}
