'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import getLogsViews from '../api/getLogsViews'
import getPreferences from '@/modules/preferences/api/getPreferences'
import { LogsView } from '../schema/LogsView.schema'

type CalendarComponentProps = {
  refreshTrigger: number
}

export default function CalendarComponent({ refreshTrigger }: CalendarComponentProps) {
  const calendarRef = React.useRef<FullCalendar | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [lang, setLang] = useState<string>('')

  async function fetchPreferences() {
    try {
      const preferences = await getPreferences()
      if (!preferences) return null
      setLang(preferences.lang)
    } catch (error) {
      console.error('Errore caricamento preferenze', error)
    }
  }

  async function fetchEvents() {
    try {
      const groupedData: LogsView[] = await getLogsViews()
      const calendarEvents: any[] = []

      for (const [date, logs] of Object.entries(groupedData)) {
        if (Array.isArray(logs)) {
          logs.forEach((log: LogsView) => {
            calendarEvents.push({
              id: log.id.toString(),
              title: log.titolo,
              color: log.color,
              start: date,
              allDay: true,
            })
          })
        }
      }

      setEvents(calendarEvents)
      calendarRef.current?.getApi().updateSize()
    } catch (error) {
      console.error('Errore caricamento eventi calendario', error)
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchPreferences()
  }, [refreshTrigger])

  return (
    <div className="w-full h-[600px] overflow-hidden">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        height="100%"
        firstDay={1}
        locale={lang}
        // Personalizza intestazione mese e anno con classe text-foreground
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        titleFormat={{
          year: 'numeric',
          month: 'long',
        }}
        // Usa render custom per titolo mese per applicare classe
        // FullCalendar non supporta prop diretta, quindi useremo CSS
        // => qui meglio mettere CSS custom (a seguire)

        // Personalizza i nomi dei giorni della settimana
        dayHeaderContent={(args) => {
          // args.date è un Date
          const weekdayName = args.text // stringa del giorno breve (es. Mon)
          return (
            <span className="text-muted-foreground font-semibold" aria-label={weekdayName}>
              {weekdayName}
            </span>
          )
        }}

        // Personalizza il numero del giorno nel giorno del mese con text-foreground
        dayCellContent={(args) => {
          // args.dayNumberText è il numero del giorno come stringa
          return <span className="text-foreground">{args.dayNumberText}</span>
        }}
      />
    </div>
  )
}
