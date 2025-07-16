"use client"

import React from "react"

interface DashboardSectionProps {
  sidebarWidth: string
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ sidebarWidth }) => {
//   const session = useSession()

  return (
    <main className={`w-[calc(100vw-${sidebarWidth})] bg-background p-4 flex flex-col`}>

      <h1 className="text-accent-sidebar-foreground font-bold uppercase w-full text-center">Dashboard</h1>

    </main>
  )
}

export default DashboardSection
