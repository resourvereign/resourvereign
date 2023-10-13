import { Plugin } from '@resourvereign/common/api/plugins.js';
import { getRequest } from '@slangy/client/rest/request.js';
export type { Plugin, PluginSchema } from '@resourvereign/common/api/plugins.js';
export { PluginType } from '@resourvereign/common/api/plugins.js';

const basePath = '/api/plugins';

export const listPlugins = () => getRequest<Plugin[]>(basePath);
