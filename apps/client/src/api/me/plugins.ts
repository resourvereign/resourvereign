import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  PluginConfig,
  UserPlugin as UserPluginFromServer,
  UserPluginInput,
} from '@resourvereign/common/api/me/plugins.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';
export { PluginStatus, PluginType } from '@resourvereign/common/api/me/plugins.js';

const basePath = '/api/me/plugins';

export type UserPlugin<T extends PluginConfig = PluginConfig> = Jsonify<UserPluginFromServer<T>>;

export type UserPluginUpdate<T extends PluginConfig = PluginConfig> = ApiModel<UserPluginInput<T>>;
export type UserPluginCreate<T extends PluginConfig = PluginConfig> = UserPluginInput<T>;

export type UserPluginData<T extends PluginConfig = PluginConfig> =
  | UserPluginUpdate<T>
  | UserPluginCreate<T>;

export const listUserPlugins = async () => await getRequest<UserPluginFromServer[]>(basePath);
export const createUserPlugin = async (plugin: UserPluginCreate) =>
  await postRequest<UserPluginInput, UserPluginFromServer>(basePath, plugin);

export const updateUserPlugin = async (plugin: UserPluginUpdate) => {
  const { id, ...rest } = plugin;
  return await putRequest<UserPluginInput, UserPluginFromServer>(`${basePath}/${id}`, rest);
};

export const removeUserPlugin = async (id: UserPlugin['id']) => {
  await deleteRequest(`${basePath}/${id}`);
};
