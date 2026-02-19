import type { Metadata } from "next";
import RegisterForm from "@/features/auth/forms/RegisterForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("register"),
  };
}
export default function RegisterPage() {
  return <RegisterForm />;
}
