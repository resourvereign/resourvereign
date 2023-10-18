import { WithTimestamps } from '@slangy/common/model/timestamps.js';

import { PluginType } from './plugin.js';

export type PluginConfig = {
  [key: string]: string;
};

export type UserPlugin<Config extends PluginConfig = PluginConfig> = WithTimestamps & {
  type: PluginType;
  name: string;
  label: string;
  color: string;
  config: Config;
};
