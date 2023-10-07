import { WithCreated } from '@slangy/common/model/timestamps.js';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export type Log = WithCreated & {
  level: LogLevel;
  message: string;
};
