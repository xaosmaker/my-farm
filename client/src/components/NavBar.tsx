"use client";
import { redirect, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

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
      <DropdownMenu>
        <DropdownMenuTrigger>{session?.user?.email}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2">
              <Settings /> <span>settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <div className="w-full" onClick={() => signOut()}>
              <LogOut />
              Sign Out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
