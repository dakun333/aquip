"use client";

import * as React from "react";
import { ADMIN_NAV_CONFIG } from "@/lib/admin-config";

import { NavMain } from "@/app/[locale]/ui/admin/layout/nav-main";

import { NavUser } from "@/app/[locale]/ui/admin/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/defaultAvatar.webp",
  },
  nav: ADMIN_NAV_CONFIG,
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.nav} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
