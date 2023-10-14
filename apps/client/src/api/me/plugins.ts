import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  MyPlugin as MyPluginFromServer,
  MyPluginInput,
  PluginConfig,
} from '@resourvereign/common/api/me/plugins.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';
export { PluginStatus, PluginType } from '@resourvereign/common/api/me/plugins.js';

const basePath = '/api/me/plugins';

export type MyPlugin<T extends PluginConfig = PluginConfig> = Jsonify<MyPluginFromServer<T>>;

export type MyPluginUpdate<T extends PluginConfig = PluginConfig> = ApiModel<MyPluginInput<T>>;
export type MyPluginCreate<T extends PluginConfig = PluginConfig> = MyPluginInput<T>;

export type MyPluginData<T extends PluginConfig = PluginConfig> =
  | MyPluginUpdate<T>
  | MyPluginCreate<T>;

export const listMyPlugins = async () => await getRequest<MyPluginFromServer[]>(basePath);
export const createMyPlugin = async (plugin: MyPluginCreate) =>
  await postRequest<MyPluginInput, MyPluginFromServer>(basePath, plugin);

export const updateMyPlugin = async (plugin: MyPluginUpdate) => {
  const { id, ...rest } = plugin;
  return await putRequest<MyPluginInput, MyPluginFromServer>(`${basePath}/${id}`, rest);
};

export const removeMyPlugin = async (id: MyPlugin['id']) => {
  await deleteRequest(`${basePath}/${id}`);
};
