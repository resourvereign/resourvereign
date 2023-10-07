import router from '@slangy/server/helpers/express/router.js';

import logs from './logs/index.js';
import plugins from './plugins/index.js';

export default router()
  .use('/logs', logs) // /api/me/logs endpoints
  .use('/plugins', plugins); // /api/me/plugins endpoints
