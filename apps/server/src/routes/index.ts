import router from '@slangy/server/helpers/express/router.js';

import api from './api/index.js';

export default router().use('/api', api); // /api endpoints
