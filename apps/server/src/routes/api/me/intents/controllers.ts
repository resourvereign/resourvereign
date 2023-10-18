import { Intent, IntentInput } from '@resourvereign/common/api/me/intents.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  RequestWithParams,
  RequestWithQuery,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { ClientErrorBadRequest, ClientErrorNotFound } from '@slangy/server/helpers/httpError.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';
import { endOfMonth, startOfMonth } from 'date-fns';

import IntentModel, { IntentDocument } from '../../../../models/intent.js';
import UserPluginModel from '../../../../models/userPlugin.js';
import { cancel, scheduleIntent } from '../../../../utils/scheduler.js';

export const intentById = controller<
  RequestWithParams<{ id: string }, RequestWithFields<JwtData & { intent: IntentDocument }>>
>(async (req, _, next) => {
  const intent = await IntentModel.findOne({
    _id: req.params.id,
    user: req.jwtUser.id,
  });

  if (!intent) {
    return next(new ClientErrorNotFound());
  }

  req.intent = intent;
  return next();
});

export const getIntents = controller<
  RequestWithQuery<{ month?: string }, RequestWithFields<JwtData>>,
  ResponseWithBody<Intent[]>
>(async (req, res) => {
  const month = req.query.month ? new Date(req.query.month) : new Date();
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const intents = await IntentModel.find({
    user: req.jwtUser.id,
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  })
    .populate('integration')
    .exec();

  return res.status(SuccessStatusCode.SuccessOK).send(intents.map((log) => log.toJSON()));
});

export const createIntent = controller<
  RequestWithBody<IntentInput, RequestWithFields<JwtData>>,
  ResponseWithBody<Intent>
>(async (req, res) => {
  const plugin = await UserPluginModel.findOne({ _id: req.body.integration, user: req.jwtUser.id });

  if (!plugin) {
    throw new ClientErrorBadRequest();
  }

  const intent = await (
    await IntentModel.create({ ...req.body, user: req.jwtUser.id })
  ).populate('integration');

  scheduleIntent(intent);

  return res.status(SuccessStatusCode.SuccessCreated).send(intent.toJSON());
});

export const updateIntent = controller<
  RequestWithBody<IntentInput, RequestWithFields<JwtData & { intent: IntentDocument }>>,
  ResponseWithBody<Intent>
>(async (req, res) => {
  const plugin = await UserPluginModel.findOne({ _id: req.body.integration, user: req.jwtUser.id });

  if (!plugin) {
    throw new ClientErrorBadRequest();
  }

  const intent = req.intent;

  intent.set({
    ...req.body,
    integration: plugin,
  });
  await intent.save();

  scheduleIntent(intent);

  return res.status(SuccessStatusCode.SuccessCreated).send(intent.toJSON());
});

export const deleteIntent = controller<RequestWithFields<{ intent: IntentDocument }>>(
  async (req, res) => {
    const intent = req.intent;

    cancel(intent);
    await intent.deleteOne();

    return res.status(SuccessStatusCode.SuccessNoContent).send();
  },
);
