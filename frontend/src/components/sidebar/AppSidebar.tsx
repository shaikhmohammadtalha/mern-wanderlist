import type { CSSProperties } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "../Logo";
import NavLinks from "../NavLinks";
import AppSidebarContent, {
  type AppSidebarContentProps,
} from "./AppSidebarContent";

export default function AppSidebar(props: AppSidebarContentProps) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-border"
      style={{ "--sidebar-width": "22rem" } as CSSProperties}
    >
      <SidebarHeader className="gap-2 border-b border-border p-3">
        <Logo className="px-2" />
        {/* The navbar shows these from xl up, so only the drawer needs them */}
        <NavLinks variant="list" className="xl:hidden" />
      </SidebarHeader>

      {/* SidebarContent already scrolls — no extra overflow/max-h wrapper needed */}
      <SidebarContent className="min-w-0">
        <AppSidebarContent {...props} />
      </SidebarContent>
    </Sidebar>
  );
}
