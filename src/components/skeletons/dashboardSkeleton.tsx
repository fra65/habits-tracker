import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Skeleton className="h-8 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
    </div>
  )
}