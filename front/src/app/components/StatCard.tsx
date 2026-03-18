import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = "bg-primary" }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
      <div className={`${color} text-white p-3 rounded-lg`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-[0.8rem] truncate">{title}</p>
        <p className="text-[1.5rem] mt-0.5">{value}</p>
        {trend && (
          <p className={`text-[0.75rem] mt-1 ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
