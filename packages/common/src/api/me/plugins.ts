import { Plugin, PluginConfig } from '../../models/plugin.js';
import { ApiModel } from '../common.js';

export { PluginType } from '../../models/plugin.js';

export enum PluginStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

type WithPluginStatus = {
  status: PluginStatus;
};

export type PluginApiModel<T extends PluginConfig = PluginConfig> = ApiModel<Plugin<T>>;

export type MyPluginRes<T extends PluginConfig = PluginConfig> = PluginApiModel<T> &
  WithPluginStatus;

export type MyPluginInputReq<T extends PluginConfig = PluginConfig> = Omit<
  Plugin<T>,
  'created' | 'updated' | 'user'
>;

export type MyPluginsRes<T extends PluginConfig = PluginConfig> = MyPluginRes<T>[];
