'use client'

import React, { useState } from "react"
import CalendarComponent from "@/modules/calendar/components/Calendar"
import ActiveHabitsList from "@/modules/habit/components/list/activeHabitsList"

export default function CalendarSection() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // funzione da passare per ricaricare calendario
  async function refreshCalendar() {
    // Incrementa il trigger per notificare a CalendarComponent il refresh
    setRefreshTrigger((prev) => prev + 1);
  }

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
          <CalendarComponent refreshTrigger={refreshTrigger} />
        </div>
        <div
          className="
            flex-grow flex-shrink basis-[35%] min-w-[320px] h-[600px] 
            box-border overflow-y-auto
          "
        >
          <ActiveHabitsList refreshCalendar={refreshCalendar} />
        </div>
      </main>
    </>
  )
}
