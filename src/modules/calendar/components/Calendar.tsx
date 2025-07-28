'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LogsView } from '../schema/LogsView.schema';
import { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import getLogsViews from '../api/getLogsViews';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarComponent() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  async function fetchEvents() {
    try {
      const groupedData: LogsView[] = await getLogsViews();
      const calendarEvents: any[] = [];

      for (const [date, logs] of Object.entries(groupedData)) {
        if (Array.isArray(logs)) {
          logs.forEach((log: LogsView) => {
            calendarEvents.push({
              id: log.id.toString(),
              title: log.titolo,
              color: log.color,
              start: date,
              allDay: true,
            });
          });
        } else {
          console.warn(`Logs per la data ${date} non è un array`, logs);
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
  }, []);

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
  );
}
