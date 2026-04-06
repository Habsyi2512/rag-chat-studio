import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cmsFetch } from "@/lib/cms";
import { StatsCard } from "@/components/StatsCard";
import { ChatStatsChart } from "@/components/ChatStatsChart";
import { ChatTrendChart } from "@/components/ChatTrendChart";
import { ResponseTimeStats } from "@/components/ResponseTimeStats";
import { HourlyActivityChart } from "@/components/HourlyActivityChart";
import { UserDemographicsChart } from "@/components/UserDemographicsChart";
import { TopQuestionsTable } from "@/components/TopQuestionsTable";
import { TrackingStatusChart } from "@/components/TrackingStatusChart";
import { UserGrowthChart } from "@/components/UserGrowthChart";
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Selamat datang di dashboard admin</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Row 1: Category Stats (full width) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ChatStatsChart />
      </div>

      {/* Row 2: Chat Trend + Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <ChatTrendChart />
        <ResponseTimeStats />
      </div>

      {/* Row 3: Hourly Activity + Demographics + Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <HourlyActivityChart />
        <UserDemographicsChart />
        <TrackingStatusChart />
      </div>

      {/* Row 4: Top Questions + User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopQuestionsTable />
        <UserGrowthChart />
      </div>
    </div>
  );
};

export default Dashboard;
