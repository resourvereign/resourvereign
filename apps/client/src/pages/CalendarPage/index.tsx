import { useCallback, useState } from 'react';

import { MyIntent, MyIntentInput } from '../../api/me/intents';
import Calendar, { CalendarEvent } from '../../components/Calendar';
import useMyIntents from '../../hooks/useMyIntents';

import EditIntentDialog from './EditIntentDialog';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingIntent, setEditingIntent] = useState<MyIntentInput | undefined>(undefined);
  const { data: myIntents } = useMyIntents();

  const handleEventClick = useCallback((event: CalendarEvent<MyIntent>) => {
    setEditingIntent({
      ...event.data,
      resource: event.data.resource.id,
    });
  }, []);

  const handleEditionFinished = useCallback(() => {
    setEditingIntent(undefined);
  }, []);

  const handleDayClick = useCallback((day: Date) => {
    setEditingIntent({
      date: day,
      resource: '',
    });
  }, []);

  return (
    <>
      <EditIntentDialog intent={editingIntent} onFinished={handleEditionFinished} />
      <div className="h-full">
        <Calendar
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
          events={myIntents.map((intent) => ({
            date: intent.date,
            text: `${intent.resource.label} (${intent.resource.name})`,
            data: intent,
          }))}
        />
      </div>
    </>
  );
};

export default CalendarPage;
