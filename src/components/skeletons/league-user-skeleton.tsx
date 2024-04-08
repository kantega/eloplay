import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function LeagueUserSkeleton({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex gap-2">
      <Skeleton className={cn("h-12 w-12 rounded-full", className)} />
      <div className="flex w-2/3 flex-col justify-around">
        <Skeleton className={cn("h-4 w-full", className)} />
        <Skeleton className={cn("h-4 w-full", className)} />
      </div>
      <Skeleton className={cn("h-12 w-1/3", className)} />
    </div>
  );
}
