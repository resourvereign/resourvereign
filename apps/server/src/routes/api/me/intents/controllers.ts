import {
  MyIntentInputReq,
  MyIntentRes,
  MyIntentsRes,
} from '@resourvereign/common/api/me/intents.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  RequestWithParams,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { ClientErrorNotFound } from '@slangy/server/helpers/httpError.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';

import IntentModel, { IntentDocument } from '../../../../models/intent.js';

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

// TODO: add pagination
export const getIntents = controller<RequestWithFields<JwtData>, ResponseWithBody<MyIntentsRes>>(
  async (req, res) => {
    const intents = await IntentModel.find({ user: req.jwtUser.id }).exec();
    return res.status(SuccessStatusCode.SuccessOK).send(intents.map((log) => log.toJSON()));
  },
);

export const createIntent = controller<
  RequestWithBody<MyIntentInputReq, RequestWithFields<JwtData>>,
  ResponseWithBody<MyIntentRes>
>(async (req, res) => {
  const intent = await IntentModel.create({ ...req.body, user: req.jwtUser.id });

  return res.status(SuccessStatusCode.SuccessCreated).send(intent.toJSON());
});

export const updateIntent = controller<
  RequestWithBody<MyIntentInputReq, RequestWithFields<{ intent: IntentDocument }>>,
  ResponseWithBody<MyIntentRes>
>(async (req, res) => {
  const intent = req.intent;

  intent.set(req.body);
  await intent.save();

  return res.status(SuccessStatusCode.SuccessCreated).send(intent.toJSON());
});

export const deleteIntent = controller<RequestWithFields<{ intent: IntentDocument }>>(
  async (req, res) => {
    const intent = req.intent;

    await intent.deleteOne();

    return res.status(SuccessStatusCode.SuccessNoContent).send();
  },
);
