import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  MyPluginInputReq,
  MyPluginRes,
  MyPluginsRes,
} from '@resourvereign/common/api/me/plugins.js';
import { PluginConfig } from '@resourvereign/common/models/plugin.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';
export { PluginStatus, PluginType } from '@resourvereign/common/api/me/plugins.js';

const basePath = '/api/me/plugins';

export type MyPlugin = MyPluginRes;

type DefaultPluginConfig = {
  [key: string]: string;
};

export type MyPluginUpdateInput<T extends PluginConfig = DefaultPluginConfig> = ApiModel<
  MyPluginInputReq<T>
>;
export type MyPluginCreateInput<T extends PluginConfig = DefaultPluginConfig> = MyPluginInputReq<T>;

export type MyPluginInput<T extends PluginConfig = DefaultPluginConfig> =
  | MyPluginUpdateInput<T>
  | MyPluginCreateInput<T>;

export const listMyPlugins = async () => await getRequest<MyPluginsRes>(basePath);
export const createMyPlugin = async (plugin: MyPluginCreateInput) =>
  await postRequest<MyPluginInputReq, MyPluginRes>(basePath, plugin);

export const updateMyPlugin = async (plugin: MyPluginUpdateInput) => {
  const { id, ...rest } = plugin;
  return await putRequest<MyPluginInputReq, MyPluginRes>(`${basePath}/${id}`, rest);
};

export const createOrUpdateMyPlugin = async (plugin: MyPluginInput) => {
  if ('id' in plugin) {
    return await updateMyPlugin(plugin);
  }

  return await createMyPlugin(plugin);
};

export const removeMyPlugin = async (plugin: MyPlugin) => {
  await deleteRequest(`${basePath}/${plugin.id}`);
};
