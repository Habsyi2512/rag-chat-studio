import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";

const DashboardContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <SidebarInset className="bg-[#f8fafc] flex flex-col min-h-screen">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center bg-white">
          {/* NavBar is now clean without notifications or toggle */}
        </div>
      </header>

      {/* Dynamic Content Section */}
      <main className="flex-1 p-6 flex flex-col w-full h-full">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>
    </SidebarInset>
  );
};

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <DashboardContent />
    </SidebarProvider>
  );
};

export default DashboardLayout;
