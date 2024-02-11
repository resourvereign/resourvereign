import { Type } from 'jtd';
import { Promisable } from 'type-fest';

import { Logger } from '../logger.js';

import { IntegrationPlugin } from './integration.js';
import { NotificationsPlugin } from './notifications.js';
import { SchedulingPlugin } from './scheduling.js';

type ResultOk<T> = [T, null | undefined];
type ResultErr<E> = [null | undefined, E];
export type Result<T, E = Error> = ResultOk<T> | ResultErr<E>;

export const Ok = <T>(value: T): ResultOk<T> => [value, undefined];
export const Err = <E>(error: E): ResultErr<E> => [undefined, error];

export enum PluginType {
  Integration = 'integration',
  Scheduling = 'scheduling',
  Notifications = 'notifications',
}

export type PluginSchemaPropertyType = Type;

export type PluginSchema = {
  properties: {
    [name: string]: {
      type: PluginSchemaPropertyType;
      nullable?: boolean;
      metadata?: {
        secret?: boolean;
        overrideable?: boolean;
        name?: string;
        description?: string;
      };
    };
  };
};

export type DefaultPluginConfig = {
  [key: string]: unknown;
};

export type PluginInstance = {
  validate: () => Promisable<boolean>;
};

export type PluginInitializer<Config extends DefaultPluginConfig, Plugin extends PluginInstance> = (
  config: Config,
  logger: Logger,
) => Promisable<Plugin>;

export type BasePlugin<
  Config extends DefaultPluginConfig,
  Plugin extends PluginInstance,
  Schema extends PluginSchema = PluginSchema,
> = {
  schema: Schema;
  register: () => Promisable<PluginInitializer<Config, Plugin>>;
  unregister: () => Promisable<void>;
};

export type Plugin = IntegrationPlugin<unknown> | NotificationsPlugin | SchedulingPlugin;
