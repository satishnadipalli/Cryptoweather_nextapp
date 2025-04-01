import { Skeleton } from "@/components/ui/skeleton"

interface DashboardSkeletonProps {
  type: "weather" | "crypto" | "news"
}

export function DashboardSkeleton({ type }: DashboardSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {type === "news"
          ? Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
          : Array(3)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
      </div>
    </div>
  )
}

