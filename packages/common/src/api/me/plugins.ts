import { PluginConfig, UserPlugin as UserPluginModel } from '../../models/userPlugin.js';
import { ApiModel } from '../common.js';

export type { PluginConfig } from '../../models/userPlugin.js';
export { PluginType } from '../../models/plugin.js';

export enum PluginStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

export type UserPluginWithoutStatus<T extends PluginConfig = PluginConfig> = ApiModel<
  UserPluginModel<T>
>;

export type UserPlugin<T extends PluginConfig = PluginConfig> = UserPluginWithoutStatus<T> & {
  status: PluginStatus;
};

export type UserPluginInput<T extends PluginConfig = PluginConfig> = Omit<
  UserPluginWithoutStatus<T>,
  'id' | 'created' | 'updated' | 'user'
>;
