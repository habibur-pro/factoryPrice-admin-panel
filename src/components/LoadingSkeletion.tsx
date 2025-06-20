import { cn } from "@/lib/utils";

const LoadingSkeletion = ({
  length,
  itemClass,
  itemWrapperClass,
}: {
  length: number;
  itemClass?: string;
  itemWrapperClass?: string;
}) => {
  return (
    <div>
      <div className="p-6">
        <div className="animate-pulse">
          <div className={cn("space-y-3", itemWrapperClass)}>
            {[...Array(length || 5)].map((_, i) => (
              <div
                key={i}
                className={cn("h-4 bg-gray-200 rounded", itemClass)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeletion;
