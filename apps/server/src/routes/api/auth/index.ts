import router from '@slangy/server/helpers/express/router.js';

import token from './tokens/index.js';

export default router().use('/tokens', token); // /api/auth/tokens endpoints
