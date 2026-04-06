import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Timer, Zap, AlertTriangle } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface ResponseTimeData {
    summary: { avg: number; min: number; max: number; count: number };
    trend: { date: string; avg_time: number }[];
}

const MONTH_NAMES = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const ResponseTimeStats = () => {
    const [data, setData] = useState<ResponseTimeData | null>(null);
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
                const res = await cmsFetch(`/response-time-stats?${qs}`);
                setData(res);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [month, year]);

    if (isLoading && !data) {
        return (
            <Card className="col-span-full lg:col-span-2">
                <CardContent className="h-[300px] flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (!data || data.summary.count === 0) {
        return (
            <Card className="col-span-full lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Timer className="h-4 w-4 text-emerald-500" />
                        Waktu Respons AI
                    </CardTitle>
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
                <CardContent className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">Belum ada data.</CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0 relative">
                <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Timer className="h-4 w-4 text-emerald-500" />
                        Waktu Respons AI
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{data.summary.count} respons tercatat</p>
                </div>
                {isLoading && <div className="absolute top-4 right-1/2 opacity-50"><Loader2 className="h-4 w-4 animate-spin" /></div>}
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
            <CardContent className="space-y-4">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center">
                        <Zap className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-emerald-700">{data.summary.avg}s</p>
                        <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Rata-rata</p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
                        <Zap className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-blue-700">{data.summary.min}s</p>
                        <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wider">Tercepat</p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-amber-700">{data.summary.max}s</p>
                        <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">Terlama</p>
                    </div>
                </div>

                {/* Trend chart */}
                <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.trend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                            <YAxis tick={{ fontSize: 10 }} unit="s" />
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`${v}s`, "Rata-rata"]} />
                            <Area type="monotone" dataKey="avg_time" stroke="#10b981" strokeWidth={2} fill="url(#colorTime)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
