import { PluginSchema, PluginType } from '@resourvereign/plugin-types/plugin/index.js';

export type { PluginSchema };
export { PluginType };

export type Plugin = {
  name: string;
  type: PluginType;
  schema: PluginSchema;
};
