import { useState } from 'react';

import Calendar from '../../components/Calendar';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="h-full">
      <Calendar month={currentMonth} onMonthChange={setCurrentMonth} />
    </div>
  );
};

export default CalendarPage;
