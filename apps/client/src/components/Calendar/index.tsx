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

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      onMonthChange?.(addMonths(month, event.deltaY > 0 ? 1 : -1));
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
      <div className={classNames(rowClassNames, styles.headerRow, 'justify-content-center')}>
        {format(month, 'MMMM yyyy')}
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
            className={classNames(cellClassNames, { [styles.fillerDay]: !isSameMonth(day, month) })}
            onClick={handleDayClick(cloneDay)}
          >
            {formattedDate}
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
    <div className="flex flex-column w-full h-full" onWheel={handleWheel}>
      {renderHeader()}
      {renderDates()}
    </div>
  );
};

export default Calendar;
