"use client";
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
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { redirect } from "next/navigation";

export default function NavBar({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  const { data: session } = useSession();
  const url = usePathname();
  const t = useTranslations("Navigation");

  if (session?.user && !session?.user?.farmId && !(url === "/farm/create")) {
    redirect("/farm/create");
  }
  return (
    <div className="flex h-14 items-center justify-between px-5 pl-2 shadow shadow-current/10">
      {children}
      <p className="text-2xl font-bold md:text-lg">{session?.user?.farmName}</p>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>{session?.user?.email}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings /> <span>{t("settings")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <div className="w-full" onClick={() => signOut()}>
                <LogOut />
                {t("signOut")}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <LocaleSwitcher />
      </div>
    </div>
  );
}
