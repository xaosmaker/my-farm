import LoginForm from "@/features/auth/forms/LoginForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Global.metaData");

  return {
    title: t("login"),
  };
};

export default function LoginPage() {
  return <LoginForm />;
}
