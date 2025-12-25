import { AppSidebar } from "@/components/app-sidebar";
import NavBar from "@/components/NavBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <NavBar>
          <SidebarTrigger />
        </NavBar>
        <div className="mx-auto mt-10 h-[calc(100dvh-7rem)] px-10">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
