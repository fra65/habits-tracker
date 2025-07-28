import React from "react"
// import DashboardSection from "@/components/sections/dashboardSection"
import CalendarComponent from "@/modules/calendar/components/Calendar"
import ActiveHabitsList from "@/modules/habit/components/list/activeHabitsList"

export default function Page() {
  // const { sidebarWidth } = useSidebar()

  return (

    <>

    <main className="bg-background p-6 h-screen py-auto flex gap-4">

      {/* <DashboardSection /> */}

      <CalendarComponent />

      <ActiveHabitsList  />

    </main>

    </>
  )
}
