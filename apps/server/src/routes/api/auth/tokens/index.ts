import router from '@slangy/server/helpers/express/router.js';
import jwt from '@slangy/server/middleware/express/auth/jwt.js';

import { checkUser } from '../../middleware.js';

import { createToken, renewToken } from './controllers.js';
import { validateTokenCreation } from './validators.js';

export default router()
  .post('/', validateTokenCreation, createToken) // POST: create a new token
  .put('/', jwt(), checkUser, renewToken); // PUT: renew a token
