import { MyLog as MyLogFromServer, MyLogPage } from '@resourvereign/common/api/me/logs.js';
import { getRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';

export { LogLevel } from '@resourvereign/common/api/me/logs.js';

const basePath = '/api/me/logs';

export type MyLog = Jsonify<MyLogFromServer>;

export const listMyLogs = (page: number) => {
  const searchParams = new URLSearchParams({ page: String(page) });
  return getRequest<MyLogPage>(`${basePath}?${searchParams.toString()}`);
};
