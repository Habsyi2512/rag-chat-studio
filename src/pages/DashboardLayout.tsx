import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

const DashboardContent = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex w-full bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative background element for glass effect visibility */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <DashboardSidebar />
      
      <main className={cn(
        "flex-1 overflow-auto flex flex-col transition-all duration-500 ease-in-out",
        isCollapsed ? "ml-24" : "ml-80"
      )}>
        <header className="h-24 flex items-center justify-end px-8 sticky top-0 z-10 transition-all duration-500">
          <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
            <NotificationDropdown />
          </div>
        </header>
        <div className="flex-1 p-8 pt-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default DashboardLayout;
