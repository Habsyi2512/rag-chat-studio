import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { HistorySidebar } from "@/components/HistorySidebar";
import LightRays from "@/components/LightRays";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("s") || undefined;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSelectSession = (id: string) => {
    setSearchParams({ s: id });
  };

  const handleNewChat = () => {
    setSearchParams({});
  };

  if (!token) return null;

  return (
    <div
      className="fixed inset-0 bg-white overflow-hidden flex"
      style={{
        backgroundImage: 'url("/background.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* White overlay for brightness */}
      <div className="absolute inset-0 bg-black/10 z-0" />
      <SEO
        title="AI Chatbot Disdukcapil Kepulauan Anambas"
        description="Layanan informasi otomatis kependudukan dan pencatatan sipil Dinas Kependudukan dan Catatan Sipil Kabupaten Kepulauan Anambas."
      />

      {/* Sidebar for History */}
      {isSidebarOpen && (
        <HistorySidebar
          currentSessionId={sessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
        />
      )}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        {/* <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays absolute h-full inset-0 z-0"
        /> */}

        {/* Header */}
        <header className="shrink-0 z-50 p-4">
          <div className="max-w-7xl border border-white/20 shadow-2xl px-6 py-4 rounded-[32px] backdrop-blur-xl bg-white/10 mx-auto flex justify-between items-center transition-all duration-500">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent drop-shadow-sm tracking-tight animate-gradient-x">
                Anambas AI Chat
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

        {/* Main Chat Interface */}
        <main className="flex-1 relative z-10 min-h-0 overflow-hidden">
          <div className="h-full w-full max-w-6xl mx-auto lg:p-6 p-0">
            <div className="h-full overflow-hidden flex flex-col ">
              <ChatInterface
                sessionId={sessionId}
                onSessionCreated={(id) => handleSelectSession(id)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
