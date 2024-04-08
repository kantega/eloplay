import { Skeleton } from "../ui/skeleton";

export default function TournamentSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full delay-150" />
      <Skeleton className="h-20 w-full delay-300" />
    </div>
  );
}
