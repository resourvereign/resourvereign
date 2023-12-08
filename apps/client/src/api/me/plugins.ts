import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  IntegrationUserPluginWithStatus as IntegrationUserPluginFromServer,
  IntegrationUserPluginInput,
  NotificationsUserPluginWithStatus as NotificationsUserPluginFromServer,
  NotificationsUserPluginInput,
  PluginConfig,
  PluginType,
  SchedulingUserPluginWithStatus as SchedulingUserPluginFromServer,
  SchedulingUserPluginInput,
  UserPluginInput,
} from '@resourvereign/common/api/me/plugins.js';
import {
  getRequest,
  postRequest,
  putRequest,
  responselessDeleteRequest,
} from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';

export { PluginStatus, PluginType } from '@resourvereign/common/api/me/plugins.js';

const basePath = '/api/me/plugins';

type UserPluginFromServer<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPluginFromServer<T>
  | NotificationsUserPluginFromServer<T>
  | SchedulingUserPluginFromServer<T>;

export type IntegrationUserPlugin<T extends PluginConfig = PluginConfig> = Jsonify<
  IntegrationUserPluginFromServer<T>
>;

export type NotificationsUserPlugin<T extends PluginConfig = PluginConfig> = Jsonify<
  NotificationsUserPluginFromServer<T>
>;

export type SchedulingUserPlugin<T extends PluginConfig = PluginConfig> = Jsonify<
  SchedulingUserPluginFromServer<T>
>;

export type UserPlugin<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPlugin<T>
  | NotificationsUserPlugin<T>
  | SchedulingUserPlugin<T>;

export type IntegrationUserPluginUpdate<T extends PluginConfig = PluginConfig> = ApiModel<
  IntegrationUserPluginInput<T>
>;
export type IntegrationUserPluginCreate<T extends PluginConfig = PluginConfig> =
  IntegrationUserPluginInput<T>;
export type IntegrationUserPluginData<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPluginUpdate<T>
  | IntegrationUserPluginCreate<T>;

export type NotificationsUserPluginUpdate<T extends PluginConfig = PluginConfig> = ApiModel<
  NotificationsUserPluginInput<T>
>;
export type NotificationsUserPluginCreate<T extends PluginConfig = PluginConfig> =
  NotificationsUserPluginInput<T>;
export type NotificationsUserPluginData<T extends PluginConfig = PluginConfig> =
  | NotificationsUserPluginUpdate<T>
  | NotificationsUserPluginCreate<T>;

export type SchedulingUserPluginUpdate<T extends PluginConfig = PluginConfig> = ApiModel<
  SchedulingUserPluginInput<T>
>;
export type SchedulingUserPluginCreate<T extends PluginConfig = PluginConfig> =
  SchedulingUserPluginInput<T>;
export type SchedulingUserPluginData<T extends PluginConfig = PluginConfig> =
  | SchedulingUserPluginUpdate<T>
  | SchedulingUserPluginCreate<T>;

export type UserPluginUpdate<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPluginUpdate<T>
  | NotificationsUserPluginUpdate<T>
  | SchedulingUserPluginUpdate<T>;
export type UserPluginCreate<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPluginCreate<T>
  | NotificationsUserPluginCreate<T>
  | SchedulingUserPluginCreate<T>;

export type UserPluginData<T extends PluginConfig = PluginConfig> =
  | IntegrationUserPluginData<T>
  | NotificationsUserPluginData<T>
  | SchedulingUserPluginData<T>;

export const userPluginToUpdate = (plugin: UserPlugin) => {
  switch (plugin.type) {
    case PluginType.Integration:
      return {
        ...plugin,
        addons: plugin.addons.map((addon) => addon.id),
      };
    case PluginType.Notifications:
    case PluginType.Scheduling:
      return plugin;
  }
};

export const listUserPlugins = async (): Promise<UserPlugin[]> =>
  await getRequest<UserPluginFromServer[]>(basePath);

export const createUserPlugin = async (plugin: UserPluginCreate): Promise<UserPlugin> =>
  await postRequest<UserPluginInput, UserPluginFromServer>(basePath, plugin);

export const updateUserPlugin = async (plugin: UserPluginUpdate): Promise<UserPlugin> => {
  const { id, ...rest } = plugin;
  return await putRequest<UserPluginInput, UserPluginFromServer>(`${basePath}/${id}`, rest);
};

export const removeUserPlugin = async (id: UserPlugin['id']) => {
  await responselessDeleteRequest(`${basePath}/${id}`);
};
