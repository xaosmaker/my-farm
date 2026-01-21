import { CardAction } from "@/components/ui/card";
import LoginForm from "@/features/auth/components/LoginForm";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  const t = await getTranslations("Login");

  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginForm
        cardAction={
          <CardAction className="p-2">
            <Link href="/register">{t("registerLink")}</Link>
          </CardAction>
        }
      />
    </div>
  );
}
