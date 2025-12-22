import { auth } from "@/lib/auth";
import { ReactNode } from "react";

export default async function NavBar({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  const session = await auth();
  return (
    <div className="flex h-14 items-center justify-between px-5 pl-2 shadow shadow-current/10">
      {children}
      <p className="text-2xl font-bold">{session?.user?.farmName}</p>
      <p>{session?.user?.email}</p>
    </div>
  );
}
