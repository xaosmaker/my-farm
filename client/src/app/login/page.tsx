import LoginForm from "@/features/auth/components/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
