import { PaginatedResponse } from '@slangy/common/api/pagination.js';

import { Log as LogModel } from '../../models/log.js';
import { ApiModel, PageMeta } from '../common.js';

export { LogLevel } from '../../models/log.js';

export type Log = ApiModel<LogModel>;

export type LogPage = PaginatedResponse<Log, PageMeta>;
