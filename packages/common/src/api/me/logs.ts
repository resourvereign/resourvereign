import { PaginatedResponse } from '@slangy/common/api/pagination.js';

import { Log } from '../../models/log.js';
import { ApiModel, PageMeta } from '../common.js';

export { LogLevel } from '../../models/log.js';

export type MyLog = ApiModel<Log>;

export type MyLogPage = PaginatedResponse<MyLog, PageMeta>;
