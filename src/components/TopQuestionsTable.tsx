import { useEffect, useState } from "react";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, HelpCircle } from "lucide-react";

interface QuestionData {
    question: string;
    total: number;
}

const MONTH_NAMES = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export const TopQuestionsTable = () => {
    const [data, setData] = useState<QuestionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [month, setMonth] = useState(0);
    const [year, setYear] = useState(currentYear);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({ limit: "10" });
                if (month > 0) params.set("month", String(month));
                params.set("year", String(year));
                const qs = params.toString();
                const res = await cmsFetch(`/top-questions?${qs}`);
                setData(res);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, [month, year]);

    return (
        <Card className="col-span-full lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between pb-3 space-y-0 relative">
                <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-amber-500" />
                        Pertanyaan Terpopuler
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">10 pertanyaan yang paling sering ditanyakan</p>
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
            <CardContent>
                {!isLoading && data.length === 0 ? (
                    <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">Belum ada data.</div>
                ) : (
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                        {data.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 leading-snug truncate">{item.question}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-600">{item.total}x</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
