import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2, Loader2, LogOut } from "lucide-react";
import { api, ChatSession } from "@/lib/api";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const HistorySidebar = ({ 
  currentSessionId, 
  onSelectSession, 
  onNewChat 
}: { 
  currentSessionId?: string; 
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        loadSessions();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Berhasil logout");
    navigate("/login");
  };

  return (
    <div className="m-4 h-[calc(100vh-2rem)] w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl flex flex-col z-20 transition-all duration-300">
      <div className="p-4 flex flex-col gap-4">
        <Button 
          onClick={onNewChat} 
          className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-2xl h-11"
        >
          <Plus size={20} />
          <span className="font-semibold text-sm">Chat Baru</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {isLoading && sessions.length === 0 && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin h-5 w-5 opacity-50" />
            </div>
          )}
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(String(session.id))}
              className={cn(
                "w-full text-left px-4 py-3 rounded-2xl text-sm transition-all duration-300 group flex items-center gap-3 border border-transparent",
                String(currentSessionId) === String(session.id) 
                  ? "bg-white/30 border-white/20 text-white font-bold" 
                  : "hover:bg-white/20 text-white/70 hover:text-white"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors shadow-sm",
                String(currentSessionId) === String(session.id) ? "bg-primary/10" : "bg-white/10 group-hover:bg-white/20"
              )}>
                <MessageSquare size={14} className={cn(
                  String(currentSessionId) === String(session.id) ? "text-primary" : "text-white/60 group-hover:text-white"
                )} />
              </div>
              <span className="truncate flex-1 tracking-tight drop-shadow-sm font-medium">{session.title || "Percakapan Baru"}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 mt-auto">
        {user && (
          <div className="mb-4 px-2">
            <p className="text-xs text-white/50 truncate drop-shadow-sm">{user.email}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{user.role}</p>
          </div>
        )}
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
        >
          <LogOut size={18} />
          <span className="font-medium">Keluar</span>
        </Button>
      </div>
    </div>
  );
};
