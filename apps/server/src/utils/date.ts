import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const toTimezone = (date: Date, timezone: string) => {
  return utcToZonedTime(zonedTimeToUtc(date, serverTimezone), timezone);
};

export const fromTimezone = (date: Date, timezone: string) => {
  return utcToZonedTime(zonedTimeToUtc(date, timezone), serverTimezone);
};
