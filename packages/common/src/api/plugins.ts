import { PluginSchema, PluginType } from '../models/plugin.js';
export type { PluginSchema };
export { PluginType };

export type Plugin = {
  name: string;
  type: PluginType;
  schema: PluginSchema;
};
