import { WithTimestamps } from '@slangy/common/model/timestamps.js';

export enum PluginType {
  Integration = 'integration',
  Notifications = 'notifications',
}

export enum PluginSchemaPropertyType {
  string = 'string',
}

export type PluginSchema = {
  properties: {
    [name: string]: {
      type: PluginSchemaPropertyType;
      metadata?: {
        secret?: boolean;
      };
    };
  };
};

export type PluginConfig = {
  [key: string]: string;
};

export type Plugin<Config extends PluginConfig = PluginConfig> = WithTimestamps & {
  type: PluginType;
  name: string;
  label: string;
  config: Config;
};
