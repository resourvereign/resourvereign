import router from '@slangy/server/helpers/express/router.js';

import auth from './auth/index.js';

export default router().use('/auth', auth);
