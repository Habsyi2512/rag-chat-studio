import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cmsFetch } from "@/lib/cms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";

interface DemoData {
    desa: string;
    total: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export const UserDemographicsChart = () => {
    const [data, setData] = useState<DemoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsFetch("/user-demographics");
                setData(res);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, []);

    const total = data.reduce((s, d) => s + d.total, 0);

    return (
        <Card className="col-span-full lg:col-span-1">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-rose-500" />
                    Pengguna per Desa
                </CardTitle>
                <p className="text-sm text-muted-foreground">{total} pengguna terdaftar</p>
            </CardHeader>
            <CardContent className="h-[250px]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Belum ada data.</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="total"
                                nameKey="desa"
                                cx="50%"
                                cy="45%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                strokeWidth={2}
                            >
                                {data.map((_entry, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                            <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};
