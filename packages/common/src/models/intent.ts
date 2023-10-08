import { WithTimestamps } from '@slangy/common/model/timestamps.js';

import { Plugin } from './plugin.js';

export type Intent = WithTimestamps & {
  date: Date;
  resource: Plugin;
};
