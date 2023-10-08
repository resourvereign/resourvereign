import router from '@slangy/server/helpers/express/router.js';

import intents from './intents/index.js';
import logs from './logs/index.js';
import plugins from './plugins/index.js';

export default router()
  .use('/intents', intents) // /api/me/intents endpoints
  .use('/logs', logs) // /api/me/logs endpoints
  .use('/plugins', plugins); // /api/me/plugins endpoints
