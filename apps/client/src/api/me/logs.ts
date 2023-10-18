import { Log as LogFromServer, LogPage } from '@resourvereign/common/api/me/logs.js';
import { getRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';

export { LogLevel } from '@resourvereign/common/api/me/logs.js';

const basePath = '/api/me/logs';

export type Log = Jsonify<LogFromServer>;

export const listLogs = (page: number) => {
  const searchParams = new URLSearchParams({ page: String(page) });
  return getRequest<LogPage>(`${basePath}?${searchParams.toString()}`);
};
