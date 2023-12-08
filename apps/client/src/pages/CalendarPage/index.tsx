import classNames from 'classnames';
import { startOfDay } from 'date-fns';
import { useCallback, useState } from 'react';

import { Intent, IntentData } from '../../api/me/intents';
import Calendar, { CalendarEvent } from '../../components/Calendar';
import EditionFormDialog from '../../components/EditionFormDialog';
import useIntents from '../../hooks/useIntents';

import EditIntentForm from './EditIntentForm';
import styles from './index.module.css';
import { rangeFromMonth } from './utils';

const CalendarPage = () => {
  const [range, setRange] = useState(rangeFromMonth(new Date()));
  const [editingIntent, setEditingIntent] = useState<IntentData | undefined>(undefined);
  const { data: intents } = useIntents(range.start, range.end);

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
    });
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setRange(rangeFromMonth(month));
  }, []);

  const beginningOfCurrentDay = startOfDay(new Date());

  return (
    <>
      <EditionFormDialog
        data={editingIntent}
        onEditionFinish={handleEditionFinish}
        renderForm={({ data, onFinished }) => (
          <EditIntentForm data={data} onFinished={onFinished} />
        )}
      />
      <div className="h-full">
        <Calendar
          month={range.start}
          onMonthChange={handleMonthChange}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
          events={intents.map((intent) => ({
            date: intent.date,
            text: intent.booking
              ? `${intent.booking.description} (${intent.integration.label})`
              : `${intent.integration.label}`,
            data: intent,
            color: `#${intent.integration.color}`,
            className: classNames({
              // TODO: maybe consider showing disabled plugins in a different way
              [styles.satisfied]: !!intent.booking,
              [styles.past]: intent.date < beginningOfCurrentDay,
            }),
          }))}
        />
      </div>
    </>
  );
};

export default CalendarPage;
