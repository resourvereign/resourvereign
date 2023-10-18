import { WithTimestamps } from '@slangy/common/model/timestamps.js';

import { UserPlugin } from './userPlugin.js';

export type Intent = WithTimestamps & {
  date: Date;
  integration: UserPlugin;
  satisfied: boolean;
};
