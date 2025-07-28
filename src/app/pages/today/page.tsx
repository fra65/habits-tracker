import React from "react"
import CalendarComponent from "@/modules/calendar/components/Calendar"
import ActiveHabitsList from "@/modules/habit/components/list/activeHabitsList"

export default function Page() {
  return (
    <>
      <main
        className="
          bg-background p-6 h-screen max-w-full 
          flex flex-wrap gap-4 box-border
        "
      >
        <div
          className="
            flex-grow flex-shrink basis-[60%] min-w-[400px] h-[600px] box-border
          "
        >
          <CalendarComponent />
        </div>
        <div
          className="
            flex-grow flex-shrink basis-[35%] min-w-[320px] h-[600px] 
            box-border overflow-y-auto
          "
        >
          <ActiveHabitsList />
        </div>
      </main>
    </>
  )
}
