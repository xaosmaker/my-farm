"use client";
import { redirect, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";

export default function NavBar({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  const { data: session } = useSession();
  const url = usePathname();

  if (session?.user && !session?.user?.farmId && !(url === "/farm/create")) {
    redirect("/farm/create");
  }
  return (
    <div className="flex h-14 items-center justify-between px-5 pl-2 shadow shadow-current/10">
      {children}
      <p className="text-2xl font-bold">{session?.user?.farmName}</p>
      <p>{session?.user?.email}</p>
    </div>
  );
}
