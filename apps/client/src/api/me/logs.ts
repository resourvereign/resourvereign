import { LogPage as LogPageFromServer } from '@resourvereign/common/api/me/logs.js';
import { getRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';
import { ArrayElement } from 'type-fest/source/internal';

import { WithParsedDate } from '../../shared/types';

export { LogLevel } from '@resourvereign/common/api/me/logs.js';

const basePath = '/api/me/logs';

type RawLogPage = Jsonify<LogPageFromServer>;

type RawLog = ArrayElement<RawLogPage['data']>;

export type Log = WithParsedDate<RawLog, 'created'>;

type LogPage = Omit<RawLogPage, 'data'> & {
  data: Log[];
};

const parseLogPage = (userLog: RawLogPage): LogPage => ({
  ...userLog,
  data: userLog.data.map((log) => ({
    ...log,
    created: new Date(log.created),
  })),
});

export const listLogs = (page: number) => {
  const searchParams = new URLSearchParams({ page: String(page) });
  return getRequest<LogPageFromServer>(`${basePath}?${searchParams.toString()}`).then(parseLogPage);
};
