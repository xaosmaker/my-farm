import LoginForm from "@/features/auth/forms/LoginForm";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Global.metaData");

  return {
    title: t("login"),
  };
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    return redirect("/");
  }
  return <LoginForm />;
}
