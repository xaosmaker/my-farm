import { Container, Home, LandPlot } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Menu items.
const items = [
  {
    title: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "fields",
    url: "/fields",
    icon: LandPlot,
  },
  {
    title: "supplies",
    url: "/supplies",
    icon: Container,
  },

  {
    title: "seasons",
    url: "/seasons",
    icon: Container,
  },
];

export function AppSidebar() {
  const t = useTranslations("Navigation");
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
