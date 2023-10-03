import router from '@slangy/server/helpers/express/router.js';

import plugins from './plugins/index.js';

export default router().use('/plugins', plugins); // /api/me/plugins endpoints
