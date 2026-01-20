"use server";
import ServerErrors from "@/components/ServerErrors";
import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/features/auth/actions/authActions";
import { auth } from "@/lib/auth";
import Link from "next/link";
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
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div>{state.errors && <ServerErrors errors={state.errors} />}</div>
      <Button asChild>
        <Link href="/verify/resend" className="">
          Resend Verification Code
        </Link>
      </Button>
    </div>
  );
}
