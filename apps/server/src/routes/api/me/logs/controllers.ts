import { LogPage } from '@resourvereign/common/api/me/logs.js';
import { PageQuery } from '@slangy/server/api/pagination.js';
import controller, {
  RequestWithFields,
  RequestWithQuery,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';
import config from 'config';

import LogModel from '../../../../models/log.js';

const limit = config.get<number>('paginationLimits.logs');

// TODO: add filtering
export const getLogs = controller<
  RequestWithQuery<PageQuery, RequestWithFields<JwtData>>,
  ResponseWithBody<LogPage>
>(async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 0;
  const skip = page * limit;

  const logs = await LogModel.find({ user: req.jwtUser.id })
    .sort({ created: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const meta = {
    total: await LogModel.countDocuments({ user: req.jwtUser.id }),
    pageSize: limit,
    page: page,
  };

  return res.status(SuccessStatusCode.SuccessOK).send({
    data: logs.map((log) => log.toJSON()),
    meta,
  });
});
