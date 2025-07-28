'use client';

import { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// import { PreferencesLangOutput } from '@/modules/preferences/schema/PreferencesLangOutputSchema';
// import getPreferences from '@/modules/preferences/api/getPreferences';

export default function CalendarComponent() {
  const calendarRef = useRef<FullCalendar | null>(null);
//   const [preferences, setPreferences] = useState<PreferencesLangOutput>({lang: "it"})

  useEffect(() => {

    const calendarApi = calendarRef.current?.getApi();

    // Ritardo per assicurare che il layout sia stabile
    const timeout = setTimeout(() => {
      calendarApi?.updateSize();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      calendarApi?.updateSize();
    });

    const container = document.getElementById('calendar-wrapper');
    if (container) resizeObserver.observe(container);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      id="calendar-wrapper"
      className="w-full h-full border-2 border-red-500"
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        height="100%"
        firstDay={1}
        locale={"it"}
        events={

          async () => {

            // getLogs()
          }
          // [
          //   { title: 'Evento A', date: '2025-07-01' },
          //   { title: 'Evento B', date: '2025-07-15' },
          // ]
      }
      />
    </div>
  );
}
