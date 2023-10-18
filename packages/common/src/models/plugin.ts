export enum PluginType {
  Integration = 'integration',
  Scheduling = 'scheduling',
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
