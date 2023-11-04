import {
  Plugin as PluginFromServer,
  PluginSchema as PluginSchemaFromServer,
} from '@resourvereign/common/api/plugins.js';
import { getRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';
export { PluginType } from '@resourvereign/common/api/plugins.js';

export type Plugin = Jsonify<PluginFromServer>;
export type PluginSchema = Jsonify<PluginSchemaFromServer>;

const basePath = '/api/plugins';

export const listPlugins = (): Promise<Plugin[]> => getRequest<PluginFromServer[]>(basePath);
