import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { HistorySidebar } from "@/components/HistorySidebar";

interface ChatbotLayoutProps {
  children: ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  sessionId?: string;
  handleSelectSession: (id: string) => void;
  handleNewChat: () => void;
}

export const ChatbotLayout = ({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  sessionId,
  handleSelectSession,
  handleNewChat
}: ChatbotLayoutProps) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div
      className="fixed inset-0 bg-white overflow-hidden flex"
      style={{
        backgroundImage: 'url("/background.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/10 z-0" />
      <SEO
        title="AI Chatbot Disdukcapil Kepulauan Anambas"
        description="Layanan informasi otomatis kependudukan dan pencatatan sipil Dinas Kependudukan dan Catatan Sipil Kabupaten Kepulauan Anambas."
      />

      {isSidebarOpen && (
        <>
          {/* Mobile Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300" 
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-[70] lg:relative lg:z-20 h-full flex items-start animate-in slide-in-from-left duration-300">
            <HistorySidebar
              currentSessionId={sessionId}
              onSelectSession={(id) => {
                handleSelectSession(id);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              onNewChat={() => {
                handleNewChat();
                // Close sidebar on mobile after new chat
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
            />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="shrink-0 z-50 p-2 lg:p-4">
          <div className="max-w-7xl border border-white/20 shadow-2xl px-4 py-3 lg:px-6 lg:py-4 rounded-[24px] lg:rounded-[32px] backdrop-blur-xl bg-white/10 mx-auto flex justify-between items-center transition-all duration-500">
            <div className="flex items-center gap-2 lg:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 text-white hover:bg-white/10"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
              <h1 className="text-base md:text-lg lg:text-xl font-black text-blue-400">
                RAG Chatbot
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {user?.role === "admin" && (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl bg-primary/10 text-primary border-primary/20">
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 relative z-10 min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
