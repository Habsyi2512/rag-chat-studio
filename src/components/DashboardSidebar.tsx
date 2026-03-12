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

  const handleLogout = async () => {
    try {
        // Mock logout - clear localStorage without calling API
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Berhasil logout");
      navigate("/login");
    }
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "hidden" : ""}>
            Menu Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50 flex items-center gap-2"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full ${collapsed ? "justify-center px-2" : "justify-start"}`}
          >
            <LogOut className={`h-4 w-4 ${collapsed ? "" : "mr-2"}`} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
