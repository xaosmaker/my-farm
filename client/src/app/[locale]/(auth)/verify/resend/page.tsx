import ResendVerForm from "@/features/auth/forms/ResendVerForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("resendVerifyEmail"),
  };
}

export default async function ResendVefifyPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ResendVerForm />
    </div>
  );
}
