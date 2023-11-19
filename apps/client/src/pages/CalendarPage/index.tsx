import classNames from 'classnames';
import { startOfDay } from 'date-fns';
import { useCallback, useState } from 'react';

import { Intent, IntentData } from '../../api/me/intents';
import Calendar, { CalendarEvent } from '../../components/Calendar';
import EditionFormDialog from '../../components/EditionFormDialog';
import useIntents from '../../hooks/useIntents';

import EditIntentForm from './EditIntentForm';
import styles from './index.module.css';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingIntent, setEditingIntent] = useState<IntentData | undefined>(undefined);
  const { data: intents } = useIntents(currentMonth);

  const handleEventClick = useCallback((event: CalendarEvent<Intent>) => {
    setEditingIntent({
      ...event.data,
      integration: event.data.integration.id,
    });
  }, []);

  const handleEditionFinish = useCallback(() => {
    setEditingIntent(undefined);
  }, []);

  const handleDayClick = useCallback((day: Date) => {
    setEditingIntent({
      date: day,
      integration: '',
      satisfied: false,
    });
  }, []);

  const beginningOfCurrentDay = startOfDay(new Date());

  return (
    <>
      <EditionFormDialog
        data={editingIntent}
        onEditionFinish={handleEditionFinish}
        renderForm={EditIntentForm}
      />
      <div className="h-full">
        <Calendar
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
          events={intents.map((intent) => ({
            date: intent.date,
            text: `${intent.integration.label} (${intent.integration.name})`,
            data: intent,
            color: `#${intent.integration.color}`,
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
