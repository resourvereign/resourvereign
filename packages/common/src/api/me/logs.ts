import { Log } from '../../models/log.js';
import { ApiModel } from '../common.js';
export { LogLevel } from '../../models/log.js';

type LogApiModel = ApiModel<Log>;

export type MyLogRes = LogApiModel;

export type MyLogsRes = MyLogRes[];
