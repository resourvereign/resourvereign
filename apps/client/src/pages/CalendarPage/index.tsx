import { useCallback, useState } from 'react';

import { MyIntent, MyIntentInput } from '../../api/me/intents';
import Calendar, { CalendarEvent } from '../../components/Calendar';
import useMyIntents from '../../hooks/useMyIntents';

import EditIntentDialog from './EditIntentDialog';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [edittingIntent, setEdittingIntent] = useState<MyIntentInput | undefined>(undefined);
  const { data: myIntents } = useMyIntents();

  const handleEventClick = useCallback((event: CalendarEvent<MyIntent>) => {
    setEdittingIntent(event.data);
  }, []);

  const handleEditionFinished = useCallback(() => {
    setEdittingIntent(undefined);
  }, []);

  const handleDayClick = useCallback((day: Date) => {
    setEdittingIntent({
      date: day,
    });
  }, []);

  return (
    <>
      <EditIntentDialog intent={edittingIntent} onFinished={handleEditionFinished} />
      <div className="h-full">
        <Calendar
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
          events={myIntents.map((intent) => ({
            date: intent.date,
            text: 'Change me',
            data: intent,
          }))}
        />
      </div>
    </>
  );
};

export default CalendarPage;
