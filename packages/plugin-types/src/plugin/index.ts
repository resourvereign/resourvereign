import { Type } from 'jtd';

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
        label?: string;
      };
    };
  };
};

export type DefaultPluginConfig = {
  [key: string]: unknown;
};

export type BasePlugin<Schema = PluginSchema> = {
  schema: Schema;
};

export type Plugin = IntegrationPlugin<unknown> | NotificationsPlugin | SchedulingPlugin;
