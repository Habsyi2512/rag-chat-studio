import { Home, MessageCircle, FileText, FileCheck, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "FAQ", icon: MessageCircle, url: "/dashboard/faq" },
  { title: "Document", icon: FileText, url: "/dashboard/document" },
  { title: "Document Tracking", icon: FileCheck, url: "/dashboard/tracking" },
];

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Berhasil logout");
    navigate("/login");
  };

  return (
    <Sidebar 
      className={cn(
        "fixed left-4 top-4 bottom-4 h-[calc(100vh-2rem)] rounded-[32px] border border-white/50 bg-white/40 backdrop-blur-2xl shadow-2xl transition-all duration-500 ease-in-out z-50",
        "[[data-sidebar=sidebar]]:bg-transparent [&>div]:bg-transparent",
        collapsed ? "w-20" : "w-72"
      )} 
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent className="bg-transparent">
        <SidebarGroup className="bg-transparent">
          <SidebarGroupLabel className={cn("px-4 py-6 text-slate-950 font-black tracking-[0.2em] text-[10px] uppercase opacity-100", collapsed && "hidden")}>
            Menu Admin
          </SidebarGroupLabel>
          <SidebarGroupContent className="bg-transparent">
            <SidebarMenu className="bg-transparent">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="px-2">
                  <NavLink
                    to={item.url}
                    end
                    className="hover:bg-white/60 flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 text-slate-900 font-bold hover:text-primary group border border-transparent hover:border-white/40"
                    activeClassName="bg-white/70 shadow-xl shadow-white/10 border-white/40 text-primary font-black"
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110 text-slate-900 group-hover:text-primary")} />
                    {!collapsed && <span className="tracking-tight">{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              "w-full rounded-2xl transition-all duration-300 gap-2",
              "bg-white/10 hover:bg-destructive/20 hover:text-destructive",
              collapsed ? "justify-center px-0" : "justify-start px-4"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
