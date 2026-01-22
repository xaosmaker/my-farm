import ResendVerForm from "@/features/auth/forms/ResendVerForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

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
