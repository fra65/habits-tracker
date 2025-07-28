'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import getLogsViews from '../api/getLogsViews'

type CalendarComponentProps = {
  refreshTrigger: number // numero che cambia per triggerare refresh
}

export default function CalendarComponent({ refreshTrigger }: CalendarComponentProps) {
  const calendarRef = React.useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  async function fetchEvents() {
    try {
      const groupedData = await getLogsViews();
      const calendarEvents: any[] = [];

      for (const [date, logs] of Object.entries(groupedData)) {
        if (Array.isArray(logs)) {
          logs.forEach((log: any) => {
            calendarEvents.push({
              id: log.id.toString(),
              title: log.titolo,
              color: log.color,
              start: date,
              allDay: true,
            });
          });
        }
      }

      setEvents(calendarEvents);
      calendarRef.current?.getApi().updateSize();
    } catch (error) {
      console.error("Errore caricamento eventi calendario", error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);  // Rifresha ogni volta che cambia refreshTrigger

  return (
    <div className="w-full h-[600px] overflow-hidden">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
        height="100%"
        firstDay={1}
        locale="it"
      />
    </div>
  )
}
