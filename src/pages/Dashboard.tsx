import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/StatsCard";
import { MessageCircle, FileText, FileCheck, Activity } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    faqCount: 0,
    documentCount: 0,
    trackingCount: 0,
    chatCount: 0,
  });

  useEffect(() => {
    // Check authentication handled by layout

    // Fetch stats
    const fetchStats = async () => {
      const [faqRes, docRes, trackRes, chatRes] = await Promise.all([
        supabase.from("faqs").select("*", { count: "exact", head: true }),
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("document_tracking").select("*", { count: "exact", head: true }),
        supabase.from("chat_messages").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        faqCount: faqRes.count || 0,
        documentCount: docRes.count || 0,
        trackingCount: trackRes.count || 0,
        chatCount: chatRes.count || 0,
      });
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di dashboard admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total FAQ"
          value={stats.faqCount}
          icon={MessageCircle}
          description="Pertanyaan yang tersedia"
        />
        <StatsCard
          title="Total Document"
          value={stats.documentCount}
          icon={FileText}
          description="Dokumen yang tersimpan"
        />
        <StatsCard
          title="Document Tracking"
          value={stats.trackingCount}
          icon={FileCheck}
          description="Dokumen yang dilacak"
        />
        <StatsCard
          title="Chat Messages"
          value={stats.chatCount}
          icon={Activity}
          description="Total pesan chat"
        />
      </div>
    </div>
  );
};

export default Dashboard;
