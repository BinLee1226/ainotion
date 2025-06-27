"use client";

import * as React from "react";
import { Bookmark, BookMarked, Github, Home } from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import { usePathname } from "next/navigation";
import { NavProjects } from "./nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { navigationData } from "@/lib/navigation";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image src={"/logo.svg"} alt="logo" width={24} height={24} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 bg-clip-text text-2xl leading-tight font-bold text-transparent">
                    BinLee
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationData.navMain} currentPath={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  );
}
