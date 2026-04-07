import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2, Loader2, LogOut, AlertCircle, Edit2, Check, X, MoreVertical } from "lucide-react";
import { api, ChatSession } from "@/lib/api";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

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

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitle(session.title || "Percakapan Baru");
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(null);
    setEditTitle("");
  };

  const saveRename = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;

    try {
      await api.updateSession(sessionId, editTitle.trim());
      setSessions(sessions.map(s => s.id === sessionId ? { ...s, title: editTitle.trim() } : s));
      setEditingSessionId(null);
      toast.success("Judul chat diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui judul");
    }
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      await api.deleteSession(sessionToDelete);
      setSessions(sessions.filter(s => s.id !== sessionToDelete));
      if (currentSessionId === sessionToDelete) {
        onNewChat();
      }
      toast.success("Chat dihapus");
    } catch (error) {
      toast.error("Gagal menghapus chat");
    } finally {
      setSessionToDelete(null);
    }
  };

  return (
    <div className="m-4 h-[calc(100vh-2rem)] w-80 lg:w-[350px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-2xl flex flex-col z-20 transition-all duration-300 overflow-hidden">
      <div className="p-4 flex  flex-col gap-4">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-2xl h-11"
        >
          <Plus size={20} />
          <span className="font-semibold text-sm">Chat Baru</span>
        </Button>
      </div>

      <div className="px-8 flex flex-col gap-4">
        <span className="text-white text-sm">Percakapan</span>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-1">
          {isLoading && sessions.length === 0 && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin h-5 w-5 opacity-50" />
            </div>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(String(session.id))}
              className={cn(
                "w-full text-left px-5 py-2 rounded-2xl text-sm transition-all duration-300 group flex items-center gap-2 border border-transparent cursor-pointer overflow-hidden",
                String(currentSessionId) === String(session.id)
                  ? "bg-white/30 border-white/20 text-white font-bold shadow-lg"
                  : "hover:bg-white/20 text-white/70 hover:text-white"
              )}
            >
              {editingSessionId === session.id ? (
                <div className="flex-1 flex items-center gap-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    className="flex-1 bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary min-w-0"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveRename(e as any, session.id);
                      if (e.key === "Escape") setEditingSessionId(null);
                    }}
                  />
                  <div className="flex shrink-0">
                    <button onClick={(e) => saveRename(e, session.id)} className="p-1 hover:text-primary transition-colors">
                      <Check size={14} />
                    </button>
                    <button onClick={cancelEditing} className="p-1 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate tracking-tight drop-shadow-sm font-medium pr-2 flex-1 min-w-0">
                    {session.title || "Percakapan Baru"}
                  </span>

                  <div className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-md transition-all duration-300 text-white/50 hover:text-white">
                          <MoreVertical size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-2xl border-white/20 bg-white/10 backdrop-blur-2xl text-white shadow-2xl p-1">
                        <DropdownMenuItem
                          onClick={(e) => startEditing(e as any, session)}
                          className="flex items-center gap-3 rounded-xl focus:bg-white/20 focus:text-white cursor-pointer px-4 py-2.5"
                        >
                          <Edit2 size={14} className="text-blue-400" />
                          <span className="text-xs font-semibold">Ubah Judul</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSessionToDelete(session.id);
                          }}
                          className="flex items-center gap-3 rounded-xl focus:bg-red-500/20 focus:text-red-400 cursor-pointer text-red-400 px-4 py-2.5"
                        >
                          <Trash2 size={14} />
                          <span className="text-xs font-semibold">Hapus Chat</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
            >
              <LogOut size={18} />
              <span className="font-medium">Keluar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl border-white/20 bg-white/10 backdrop-blur-2xl text-white shadow-2xl">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-red-500/20 rounded-2xl">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <AlertDialogTitle className="text-xl font-bold">Keluar Aplikasi?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-white/70">
                Apakah Anda yakin ingin keluar dari sesi chatbot ini? Anda perlu login kembali untuk melanjutkan percakapan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 mt-4">
              <AlertDialogCancel className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-2xl h-11 border-none outline-none focus:ring-0">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white rounded-2xl h-11 px-6 shadow-lg shadow-red-500/20"
              >
                Ya, Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!sessionToDelete} onOpenChange={(open) => !open && setSessionToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-white/20 bg-white/10 backdrop-blur-2xl text-white shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <AlertDialogTitle className="text-xl font-bold">Hapus Percakapan?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-white/70">
              Tindakan ini tidak dapat dibatalkan. Semua riwayat pesan dalam percakapan ini akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-2xl h-11 border-none outline-none focus:ring-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-2xl h-11 px-6 shadow-lg shadow-red-500/20"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
