import { MyLog } from '@resourvereign/common/api/me/logs.js';
import controller, {
  RequestWithFields,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';

import LogModel from '../../../../models/log.js';

// TODO: add pagination
export const getLogs = controller<RequestWithFields<JwtData>, ResponseWithBody<MyLog[]>>(
  async (req, res) => {
    const logs = await LogModel.find({ user: req.jwtUser.id }).sort({ created: -1 }).exec();
    return res.status(SuccessStatusCode.SuccessOK).send(logs.map((log) => log.toJSON()));
  },
);
