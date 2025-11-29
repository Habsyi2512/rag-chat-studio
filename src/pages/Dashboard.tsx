import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cmsFetch } from "@/lib/cms";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication handled by layout

    // Fetch stats
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await cmsFetch("/dashboard-stats");
        setStats({
          faqCount: response.faqCount || 0,
          documentCount: response.documentCount || 0,
          trackingCount: response.trackingCount || 0,
          chatCount: response.chatCount || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
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
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Document"
          value={stats.documentCount}
          icon={FileText}
          description="Dokumen yang tersimpan"
          isLoading={isLoading}
        />
        <StatsCard
          title="Document Tracking"
          value={stats.trackingCount}
          icon={FileCheck}
          description="Dokumen yang dilacak"
          isLoading={isLoading}
        />
        <StatsCard
          title="Chat Messages"
          value={stats.chatCount}
          icon={Activity}
          description="Total pesan chat"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
