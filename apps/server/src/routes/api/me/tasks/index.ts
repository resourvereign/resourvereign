import router from '@slangy/server/helpers/express/router.js';

import { getTasks } from './controllers.js';

export default router().get('/', getTasks); // GET: list tasks; // DELETE: delete intent
