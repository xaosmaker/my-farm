import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getAuth() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/login");
  }
  return session;
}
