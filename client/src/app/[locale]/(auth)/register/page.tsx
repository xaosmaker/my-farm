import { CardAction } from "@/components/ui/card";
import RegForm from "@/features/auth/components/RegForm";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <RegForm
        cardAction={
          <CardAction>
            <Link href="/login">Sing in</Link>
          </CardAction>
        }
      />
    </div>
  );
}
