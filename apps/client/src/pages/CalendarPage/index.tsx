import classNames from 'classnames';
import { startOfDay } from 'date-fns';
import { useCallback, useState } from 'react';

import { MyIntent, MyIntentData } from '../../api/me/intents';
import Calendar, { CalendarEvent } from '../../components/Calendar';
import useMyIntents from '../../hooks/useMyIntents';

import EditIntentDialog from './EditIntentDialog';
import styles from './index.module.css';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingIntent, setEditingIntent] = useState<MyIntentData | undefined>(undefined);
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
      satisfied: false,
    });
  }, []);

  const beginningOfCurrentDay = startOfDay(new Date());

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
            className: classNames({
              // TODO: maybe consider showing disabled plugins in a different way
              [styles.satisfied]: intent.satisfied,
              [styles.past]: intent.date < beginningOfCurrentDay,
            }),
          }))}
        />
      </div>
    </>
  );
};

export default CalendarPage;
