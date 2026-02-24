import type { Metadata } from "next";
import RegisterForm from "@/features/auth/forms/RegisterForm";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("register"),
  };
}
export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/farm");
  }
  return <RegisterForm />;
}
