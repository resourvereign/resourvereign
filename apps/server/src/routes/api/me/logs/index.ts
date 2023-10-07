import router from '@slangy/server/helpers/express/router.js';

import { getLogs } from './controllers.js';

export default router().get('/', getLogs); // GET: list logs
