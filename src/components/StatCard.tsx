import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
};

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
  className,
}: StatCardProps) => {
  return (
    <div className={cn("data-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "p-2 rounded-md",
            iconColor.replace("text-", "bg-") + "/20"
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <p
              className={cn(
                "flex items-center text-xs mt-1",
                change.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span className="mr-1">{change.isPositive ? "▲" : "▼"}</span>
              {Math.abs(change.value)}% from last week
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default StatCard;
