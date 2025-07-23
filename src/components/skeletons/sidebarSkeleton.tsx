import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function SidebarSkeleton() {
  return (
    <aside className="w-64 p-4 space-y-4 border-r border-gray-200 dark:border-gray-700 bg-sidebar">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-6 rounded-md" />
      ))}
    </aside>
  )
}
