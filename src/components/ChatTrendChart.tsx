import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";

interface TrendData {
    date: string;
    total: number;
}

const MONTH_NAMES = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const ChatTrendChart = () => {
    const [data, setData] = useState<TrendData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [month, setMonth] = useState(0); // 0 = all months
    const [year, setYear] = useState(currentYear);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (month > 0) params.set("month", String(month));
                params.set("year", String(year));
                const qs = params.toString();
                const res = await cmsFetch(`/chat-trend?${qs}`);
                setData(res);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [month, year]);

    const totalMessages = data.reduce((s, d) => s + d.total, 0);

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        Tren Percakapan Harian
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? "Memuat..." : `${totalMessages} pesan — ${month > 0 ? MONTH_NAMES[month] : "Tahun"} ${year}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select value={month} onChange={e => setMonth(Number(e.target.value))}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-blue-400 transition-all cursor-pointer">
                        {MONTH_NAMES.map((n, i) => <option key={i} value={i}>{n}</option>)}
                    </select>
                    <select value={year} onChange={e => setYear(Number(e.target.value))}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-sm outline-none focus:border-blue-400 transition-all cursor-pointer">
                        {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </CardHeader>
            <CardContent className="h-[250px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Tidak ada data.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: "#3b82f6" }} name="Pesan" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};
