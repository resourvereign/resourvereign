import { Plugin } from '@resourvereign/common/api/plugins.js';
import controller, {
  Request,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { SuccessStatusCode } from '@slangy/server/http.js';

import { getAllPlugins } from '../../../utils/plugin.js';

export const getPlugins = controller<Request, ResponseWithBody<Plugin[]>>(async (_req, res) => {
  return res.status(SuccessStatusCode.SuccessOK).send(
    getAllPlugins().map(({ name, type, plugin }) => ({
      name,
      type,
      schema: plugin.schema,
    })),
  );
});
