import router from '@slangy/server/helpers/express/router.js';

import { createIntent, deleteIntent, getIntents, intentById, updateIntent } from './controllers.js';

export default router()
  .use('/:id', intentById)
  .get('/', getIntents) // GET: list intents
  .post('/', createIntent) // POST: create intent
  .put('/:id', updateIntent) // PUT: update intent
  .delete('/:id', deleteIntent); // DELETE: delete intent
