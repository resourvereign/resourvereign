import {
  IntegrationUserPlugin as IntegrationUserPluginModel,
  NotificationsUserPlugin as NotificationsUserPluginModel,
  PluginConfig,
  SchedulingUserPlugin as SchedulingUserPluginModel,
  UserPluginAddon,
} from '../../models/userPlugin.js';
import { ApiModel } from '../common.js';

export type { PluginConfig } from '../../models/userPlugin.js';
export { PluginType } from '../../models/plugin.js';

export enum PluginStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

export type IntegrationUserPlugin<T extends PluginConfig = PluginConfig> = ApiModel<
  Omit<IntegrationUserPluginModel<T>, 'addons'> & {
    addons: ApiModel<UserPluginAddon>[];
  }
>;

export type NotificationsUserPlugin<T extends PluginConfig = PluginConfig> = ApiModel<
  NotificationsUserPluginModel<T>
>;

export type SchedulingUserPlugin<T extends PluginConfig = PluginConfig> = ApiModel<
  SchedulingUserPluginModel<T>
>;

export type UserPlugin<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPlugin<T>
  | NotificationsUserPlugin<T>
  | SchedulingUserPlugin<T>;

type WithStatus = {
  status: PluginStatus;
};

export type IntegrationUserPluginWithStatus<T extends PluginConfig = PluginConfig> =
  IntegrationUserPlugin<T> & WithStatus;

export type NotificationsUserPluginWithStatus<T extends PluginConfig = PluginConfig> =
  NotificationsUserPlugin<T> & WithStatus;

export type SchedulingUserPluginWithStatus<T extends PluginConfig = PluginConfig> =
  SchedulingUserPlugin<T> & WithStatus;

export type UserPluginWithStatus<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPluginWithStatus<T>
  | NotificationsUserPluginWithStatus<T>
  | SchedulingUserPluginWithStatus<T>;

type UserPluginInputExcluded = 'id' | 'created' | 'updated' | 'user';

export type IntegrationUserPluginInput<T extends PluginConfig = PluginConfig> = Omit<
  IntegrationUserPlugin<T>,
  UserPluginInputExcluded | 'addons'
> & {
  addons: string[];
};

export type NotificationsUserPluginInput<T extends PluginConfig = PluginConfig> = Omit<
  NotificationsUserPlugin<T>,
  UserPluginInputExcluded
>;

export type SchedulingUserPluginInput<T extends PluginConfig = PluginConfig> = Omit<
  SchedulingUserPlugin<T>,
  UserPluginInputExcluded
>;

export type UserPluginInput<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPluginInput<T>
  | NotificationsUserPluginInput<T>
  | SchedulingUserPluginInput<T>;
