import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;

  icon: LucideIcon;
  iconColor?: string;
  className?: string;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  className,
}: StatCardProps) => {
  return (
    <div className={cn("shadow p-5 rounded border  ", className)}>
      <div className="flex items-center  mb-4">
        <div
          className={cn(
            "mr-2 rounded-md",
            iconColor.replace("text-", "bg-") + "/20"
          )}
        >
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};
export default StatCard;
