import { WithTimestamps } from '@slangy/common/model/timestamps.js';

export type Intent = WithTimestamps & {
  date: Date;
};
