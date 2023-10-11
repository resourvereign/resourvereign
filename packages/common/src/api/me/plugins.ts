import { Plugin, PluginConfig } from '../../models/plugin.js';
import { ApiModel } from '../common.js';

export { PluginType, PluginConfig } from '../../models/plugin.js';

export enum PluginStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

export type MyPluginWithoutStatus<T extends PluginConfig = PluginConfig> = ApiModel<Plugin<T>>;

export type MyPlugin<T extends PluginConfig = PluginConfig> = MyPluginWithoutStatus<T> & {
  status: PluginStatus;
};

export type MyPluginInput<T extends PluginConfig = PluginConfig> = Omit<
  Plugin<T>,
  'created' | 'updated' | 'user'
>;
