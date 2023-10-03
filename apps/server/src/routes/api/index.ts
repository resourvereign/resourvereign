import router from '@slangy/server/helpers/express/router.js';
import jwt from '@slangy/server/middleware/express/auth/jwt.js';

import auth from './auth/index.js';
import me from './me/index.js';
import plugins from './plugins/index.js';

export default router()
  .use('/auth', auth) // /api/auth endpoints
  .use('/me', jwt(), me) // /api/me endpoints
  .use('/plugins', jwt(), plugins); // /api/plugins endpoints
