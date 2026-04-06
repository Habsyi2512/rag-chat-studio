import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";

interface GrowthData {
    date: string;
    new_users: number;
    total_users: number;
}

const MONTH_NAMES = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const UserGrowthChart = () => {
    const [data, setData] = useState<GrowthData[]>([]);
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
                const res = await cmsFetch(`/user-growth?${qs}`);
                setData(res);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [month, year]);

    const totalUsers = data.length > 0 ? data[data.length - 1].total_users : 0;

    return (
        <Card className="col-span-full lg:col-span-1">
            <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0 relative">
                <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-500" />
                        Pertumbuhan Pengguna
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{totalUsers} total pengguna</p>
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
            <CardContent className="h-[250px] relative">
                {!isLoading && data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Belum ada data.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                            <Line type="stepAfter" dataKey="total_users" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} name="Total User" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};
