import { Book } from '@resourvereign/plugin-types/plugin/integration.js';
import { WithTimestamps } from '@slangy/common/model/timestamps.js';

import { IntegrationUserPlugin } from './userPlugin.js';

export type Intent = WithTimestamps & {
  date: Date;
  integration: IntegrationUserPlugin;
  book: Book<unknown> | undefined;
};
