"use client"

import React from "react"
import { ThemeToggle } from "@/components/button/theme-toggle"

interface DashboardSectionProps {
  sidebarWidth: string
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ sidebarWidth }) => {
//   const session = useSession()

  return (
    <main className={`w-[calc(100vw-${sidebarWidth})] bg-background min-h-screen p-4 flex flex-col`}>
      <ThemeToggle />

      <h1 className="text-accent-sidebar-foreground font-bold uppercase w-full text-center">Dashboard</h1>

    </main>
  )
}

export default DashboardSection
