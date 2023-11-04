import { WithTimestamps } from '@slangy/common/model/timestamps.js';

import { PluginType } from './plugin.js';

export type PluginConfig = {
  [key: string]: string;
};

export type BaseUserPlugin<Config extends PluginConfig = PluginConfig> = WithTimestamps & {
  type: PluginType;
  name: string;
  label: string;
  config: Config;
};

export type NotificationsUserPlugin<Config extends PluginConfig = PluginConfig> =
  BaseUserPlugin<Config> & {
    type: PluginType.Notifications;
  };

export type SchedulingUserPlugin<Config extends PluginConfig = PluginConfig> =
  BaseUserPlugin<Config> & {
    type: PluginType.Scheduling;
  };

export type UserPluginAddon<Config extends PluginConfig = PluginConfig> =
  | NotificationsUserPlugin<Config>
  | SchedulingUserPlugin<Config>;

export type IntegrationUserPlugin<Config extends PluginConfig = PluginConfig> =
  BaseUserPlugin<Config> & {
    type: PluginType.Integration;
    color: string;
    addons: UserPluginAddon[];
  };
