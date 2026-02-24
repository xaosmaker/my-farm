"use server";
import H1 from "@/components/H1";
import ServerError from "@/components/ServerError";
import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/features/auth/authActions";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Global.metaData");
  return {
    title: t("verifyEmail"),
  };
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  const data = { token };
  const state = await verifyEmailAction(undefined, data);
  //
  if (state.success) {
    redirect("/");
  }
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  const t = await getTranslations("Verification");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <H1 className="text-md text-red-500 capitalize">{t("wrong")}</H1>

      <div>{state.errors && <ServerError errors={state.errors} />}</div>
      <Button asChild className="bg-green-600 hover:bg-green-500">
        <Link href="/verify/resend">{t("resend")}</Link>
      </Button>
    </div>
  );
}
