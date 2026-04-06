import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarDays } from "lucide-react";

interface ChatStat {
    category: string;
    total: number;
}

const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#f97316",
];

const MONTH_NAMES = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const ChatStatsChart = () => {
    const [data, setData] = useState<ChatStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const fetchStats = async (month: number, year: number) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (month > 0) params.set("month", String(month));
            if (year > 0) params.set("year", String(year));
            const qs = params.toString();
            const response = await cmsFetch(`/chat-stats${qs ? `?${qs}` : ""}`);
            setData(response);
        } catch (error) {
            console.error("Failed to fetch chat stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(selectedMonth, selectedYear);
    }, [selectedMonth, selectedYear]);

    const totalQuestions = data.reduce((sum, d) => sum + d.total, 0);

    const periodLabel = selectedMonth > 0
        ? `${MONTH_NAMES[selectedMonth]} ${selectedYear}`
        : `Tahun ${selectedYear}`;

    return (
        <Card className="col-span-4">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold">Statistik Kategori Pertanyaan</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? "Memuat..." : `${totalQuestions} pertanyaan — ${periodLabel}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                        {MONTH_NAMES.map((name, i) => (
                            <option key={i} value={i}>{name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                        {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </CardHeader>
            <CardContent className="h-[300px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Tidak ada data untuk periode {periodLabel}.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: "rgba(59,130,246,0.05)" }}
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Bar dataKey="total" fill="#8884d8" radius={[6, 6, 0, 0]}>
                                {data.map((_entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};
