import routes from '@slangy/server/test-utils/routes.js';

import router from './index.js';

routes(router, '/api/me', ['/intents', '/logs', '/plugins', '/tasks']);
