import { MyLogsRes } from '@resourvereign/common/api/me/logs.js';
import { getRequest } from '@slangy/client/rest/request.js';
export type { MyLogRes } from '@resourvereign/common/api/me/logs.js';
export { LogLevel } from '@resourvereign/common/api/me/logs.js';

const basePath = '/api/me/logs';

// TODO: add pagination
export const listMyLogs = () => getRequest<MyLogsRes>(basePath);
