import router from '@slangy/server/helpers/express/router.js';

import { createPlugin, deletePlugin, getPlugins, pluginById, updatePlugin } from './controllers.js';

export default router()
  .use('/:id', pluginById)
  .get('/', getPlugins) // GET: list plugins
  .post('/', createPlugin) // POST: create plugin
  .put('/:id', updatePlugin) // PUT: update plugin
  .delete('/:id', deletePlugin); // DELETE: delete plugin
