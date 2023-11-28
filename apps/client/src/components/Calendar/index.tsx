import classNames from 'classnames';
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  getISOWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { Button } from 'primereact/button';
import { MouseEvent, useCallback } from 'react';

import styles from './index.module.css';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type CalendarEvent<EventData = never> = {
  date: Date;
  text: string;
  className?: string;
  color?: string;
  data: EventData;
};

type CalendarProps<EventData = never> = {
  month: Date;
  onMonthChange?: (month: Date) => void;
  onDayClick?: (day: Date) => void;
  onEventClick?: (event: CalendarEvent<EventData>) => void;
  events?: CalendarEvent<EventData>[];
};

const Calendar = <EventData = never,>({
  month,
  onMonthChange,
  onDayClick,
  onEventClick,
  events = [],
}: CalendarProps<EventData>) => {
  const cellClassNames = ['flex align-items-center flex-column', styles.cell];
  const rowClassNames = ['flex flex-row', styles.row];

  const handleCalendarScroll = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      onMonthChange?.(addMonths(startOfMonth(month), event.deltaY > 0 ? 1 : -1));
    },
    [month, onMonthChange],
  );

  const handleMonthChange = useCallback(
    (monthDelta: number) => () => {
      onMonthChange?.(addMonths(startOfMonth(month), monthDelta));
    },
    [month, onMonthChange],
  );

  const handleDayClick = useCallback(
    (day: Date) => () => {
      onDayClick?.(day);
    },
    [onDayClick],
  );

  const handleEventClick = useCallback(
    (event: CalendarEvent<EventData>) => (click: MouseEvent) => {
      onEventClick?.(event);
      click.stopPropagation();
    },
    [onEventClick],
  );

  const renderHeader = () => (
    <>
      <div
        className={classNames(
          rowClassNames,
          styles.headerRow,
          'justify-content-center',
          'align-items-center',
        )}
      >
        <Button rounded outlined icon="pi pi-arrow-left" onClick={handleMonthChange(-1)} />
        <span className="mx-2">{format(month, 'MMMM yyyy')}</span>
        <Button rounded outlined icon="pi pi-arrow-right" onClick={handleMonthChange(1)} />
      </div>
      <div className={classNames(rowClassNames, styles.weekDaysRow)}>
        {daysOfWeek.map((day) => (
          <div key={day} className={classNames(cellClassNames, styles.headerCell)}>
            {day}
          </div>
        ))}
      </div>
    </>
  );

  const renderDates = () => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    // TODO: Make week start come from locale
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateRows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const eventsForDay = events.filter((event) => isSameDay(event.date, cloneDay));
        days.push(
          <div
            key={day.toString()}
            className={classNames(cellClassNames, {
              [styles.fillerDay]: !isSameMonth(day, month),
              [styles.today]: isSameDay(day, new Date()),
            })}
            onClick={handleDayClick(cloneDay)}
          >
            <div className={styles.dateLabel}>{formattedDate}</div>
            {eventsForDay.map((event, index) => (
              <div
                key={`${event.date}-${event.text}-${index}`}
                className={classNames(styles.event, 'w-full text-sm', event.className)}
                style={{ backgroundColor: event.color }}
                onClick={handleEventClick(event)}
              >
                {event.text}
              </div>
            ))}
          </div>,
        );
        day = addDays(day, 1);
      }
      dateRows.push(
        <div
          key={getISOWeek(day)}
          className={classNames(rowClassNames, styles.bodyRow, 'flex-grow-1')}
        >
          {days}
        </div>,
      );
      days = [];
    }

    return <>{dateRows}</>;
  };

  return (
    <div className="flex flex-column w-full h-full" onWheel={handleCalendarScroll}>
      {renderHeader()}
      {renderDates()}
    </div>
  );
};

export default Calendar;
