import React from "react"
// import { useSidebar } from "@/components/ui/sidebar"
import DashboardSection from "@/components/sections/dashboardSection"
import CreateHabitForm from "@/modules/habits/createHabitsForm"

export default function Page() {
  // const { sidebarWidth } = useSidebar()

  return (

    <>

      <DashboardSection />

      <CreateHabitForm />

    </>
  )
}
