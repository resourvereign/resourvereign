import { Method } from '@slangy/server/http.js';
import routes from '@slangy/server/test-utils/routes.js';

import router from './index.js';

routes(router, '/api/plugins', [[Method.GET, '/']]);
