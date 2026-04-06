import { Home, MessageCircle, FileText, FileCheck, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
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
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-4 border-b border-slate-100 mb-2 min-h-[64px] flex flex-row items-center justify-between">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed ? "hidden" : "w-full")}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-sm tracking-tight">Admin Panel</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Disdukcapil</span>
          </div>
        </div>
        <SidebarTrigger className={cn("shrink-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800", collapsed ? "mx-auto" : "")} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-xs font-semibold text-slate-400 mb-2 transition-all", collapsed && "opacity-0 invisible")}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium border border-transparent group overflow-hidden",
                      collapsed ? "justify-center w-10 h-10 mx-auto px-0" : "gap-3 px-3 py-2.5"
                    )}
                    activeClassName="bg-blue-50 text-blue-700 font-semibold border-blue-100 shadow-sm"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2 h-10 overflow-hidden",
            collapsed ? "justify-center px-0 w-10 mx-auto" : "justify-start px-3"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
