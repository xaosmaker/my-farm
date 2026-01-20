"use server";
import ServerErrors from "@/components/ServerErrors";
import { verifyEmailAction } from "@/features/auth/actions/authActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p>waiting form verification</p>
      <div>{state.errors && <ServerErrors errors={state.errors} />}</div>
    </div>
  );
}
