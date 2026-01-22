import { CardAction } from "@/components/ui/card";
import RegForm from "@/features/auth/forms/RegForm";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function RegisterPage() {
  const session = await auth();
  const t = await getTranslations("Register");

  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <RegForm
        cardAction={
          <CardAction className="p-2">
            <Link href="/login">{t("loginLink")}</Link>
          </CardAction>
        }
      />
    </div>
  );
}
