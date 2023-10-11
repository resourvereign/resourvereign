import { MyLog as MyLogFromServer } from '@resourvereign/common/api/me/logs.js';
import { getRequest } from '@slangy/client/rest/request.js';
import { Serialized } from '@slangy/client/types.js';

export { LogLevel } from '@resourvereign/common/api/me/logs.js';

const basePath = '/api/me/logs';

export type MyLog = Serialized<MyLogFromServer>;

// TODO: add pagination
export const listMyLogs = () => getRequest<MyLogFromServer[]>(basePath);
