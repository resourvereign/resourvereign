import { ApiModel } from '@resourvereign/common/api/common.js';
import { MyPluginInputReq, MyPluginRes, MyPluginsRes } from '@resourvereign/common/api/me.js';
import { PluginConfig } from '@resourvereign/common/models/plugin.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';

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
export const createMyPlugin = async <T extends PluginConfig>(plugin: MyPluginCreateInput<T>) =>
  await postRequest<MyPluginInputReq<T>, MyPluginRes>(basePath, plugin);

export const updateMyPlugin = async <T extends PluginConfig>(plugin: MyPluginUpdateInput<T>) => {
  const { id, ...rest } = plugin;
  return await putRequest<MyPluginInputReq<T>, MyPluginRes>(`${basePath}/${id}`, rest);
};

export const createOrUpdateMyPlugin = async <T extends PluginConfig>(plugin: MyPluginInput<T>) => {
  if ('id' in plugin) {
    return await updateMyPlugin(plugin);
  }

  return await createMyPlugin(plugin);
};

export const removeMyPlugin = async (plugin: MyPlugin) => {
  await deleteRequest(`${basePath}/${plugin.id}`);
};
