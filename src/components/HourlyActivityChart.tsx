import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Clock } from "lucide-react";

interface HourlyData {
    hour: string;
    total: number;
}

const MONTH_NAMES = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const HourlyActivityChart = () => {
    const [data, setData] = useState<HourlyData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(currentYear);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (month > 0) params.set("month", String(month));
                params.set("year", String(year));
                const qs = params.toString();
                const res = await cmsFetch(`/hourly-activity?${qs}`);
                setData(res);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [month, year]);

    const maxVal = Math.max(...data.map(d => d.total), 1);

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0">
                <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-violet-500" />
                        Aktivitas per Jam
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Distribusi percakapan dalam 24 jam</p>
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
            <CardContent className="h-[250px] relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading && data.every(d => d.total === 0) ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Tidak ada data di periode ini.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="hour" tick={{ fontSize: 9 }} interval={1} tickFormatter={(v) => v.slice(0, 2)} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                            <Bar dataKey="total" radius={[3, 3, 0, 0]} name="Total Pesan">
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.total > 0 ? `rgba(139, 92, 246, ${0.3 + (entry.total / maxVal) * 0.7})` : "#e2e8f0"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};
