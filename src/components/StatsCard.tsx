import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "react-countup";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
}

export const StatsCard = ({ title, value, icon: Icon, description, isLoading }: StatsCardProps) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-card/60 border-border/40 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <p className="text-3xl font-bold">
              <CountUp end={value} duration={2} />
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};
