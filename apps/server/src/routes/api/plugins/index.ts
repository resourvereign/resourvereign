import router from '@slangy/server/helpers/express/router.js';

import { getPlugins } from './controllers.js';

export default router().get('/', getPlugins); // GET: list plugins
