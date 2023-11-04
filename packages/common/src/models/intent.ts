import { WithTimestamps } from '@slangy/common/model/timestamps.js';

import { IntegrationUserPlugin } from './userPlugin.js';

export type Intent = WithTimestamps & {
  date: Date;
  integration: IntegrationUserPlugin;
  satisfied: boolean;
};
