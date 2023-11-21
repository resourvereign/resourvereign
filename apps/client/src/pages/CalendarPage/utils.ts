import { endOfMonth, startOfMonth } from 'date-fns';

export const rangeFromMonth = (month: Date) => ({
  start: startOfMonth(month),
  end: endOfMonth(month),
});
