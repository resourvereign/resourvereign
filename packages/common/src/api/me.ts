import { Plugin, PluginConfig } from '../models/plugin.js';

import { ApiModel } from './common.js';

export enum PluginStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

type WithPluginStatus = {
  status: PluginStatus;
};

type PluginApiModel<T extends PluginConfig = never> = ApiModel<Plugin<T>>;

export type MyPluginRes<T extends PluginConfig = never> = PluginApiModel<T> & WithPluginStatus;

export type MyPluginInputReq<T extends PluginConfig = never> = Omit<
  Plugin<T>,
  'created' | 'updated' | 'user'
>;

export type MyPluginsRes<T extends PluginConfig = never> = MyPluginRes<T>[];
