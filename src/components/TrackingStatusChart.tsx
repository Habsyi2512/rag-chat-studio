import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileCheck } from "lucide-react";

interface TrackingData {
    by_status: { status: string; total: number }[];
    by_type: { type: string; total: number }[];
}

const STATUS_COLORS: Record<string, string> = {
    "Selesai": "#10b981",
    "Diproses": "#3b82f6",
    "Menunggu Verifikasi Pusat": "#f59e0b",
    "Ditolak": "#ef4444",
};
const DEFAULT_COLORS = ["#8b5cf6", "#06b6d4", "#ec4899", "#f97316", "#84cc16"];

export const TrackingStatusChart = () => {
    const [data, setData] = useState<TrackingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsFetch("/tracking-status");
                setData(res);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, []);

    const totalDocs = data?.by_status.reduce((s, d) => s + d.total, 0) || 0;

    return (
        <Card className="col-span-full lg:col-span-1">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-cyan-500" />
                    Status Pelacakan
                </CardTitle>
                <p className="text-sm text-muted-foreground">{totalDocs} dokumen tercatat</p>
            </CardHeader>
            <CardContent className="h-[250px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : !data || totalDocs === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Belum ada data pelacakan.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.by_status}
                                dataKey="total"
                                nameKey="status"
                                cx="50%"
                                cy="45%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                strokeWidth={2}
                            >
                                {data.by_status.map((entry, i) => (
                                    <Cell key={i} fill={STATUS_COLORS[entry.status] || DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                            <Legend wrapperStyle={{ fontSize: "10px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};
