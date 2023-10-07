import { Method } from '@slangy/server/http.js';
import routes from '@slangy/server/test-utils/routes.js';

import router from './index.js';

routes(router, '/api/me/plugins', [
  '/:id',
  [Method.GET, '/'],
  [Method.POST, '/'],
  [Method.PUT, '/:id'],
  [Method.DELETE, '/:id'],
]);
