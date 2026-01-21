import { AppSidebar } from "@/components/app-sidebar";
import NavBar from "@/components/NavBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";
export default async function layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const sesion = await auth();
  if (!sesion?.user) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SessionProvider>
          <NavBar>
            <SidebarTrigger />
          </NavBar>
        </SessionProvider>
        <div className="mx-auto mt-10 h-[calc(100dvh-7rem)] px-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
