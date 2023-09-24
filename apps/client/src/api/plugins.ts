import { PluginsRes } from '@resourvereign/common/api/plugins.js';
import { getRequest } from '@slangy/client/rest/request.js';

const basePath = '/api/plugins';

export const listPlugins = () => getRequest<PluginsRes>(basePath);
