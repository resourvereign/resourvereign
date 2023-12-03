import { CreateTokenReq, CreateTokenRes } from '@resourvereign/common/api/auth.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { ClientErrorUnauthorized } from '@slangy/server/helpers/httpError.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { generateToken } from '@slangy/server/middleware/express/auth/jwt.js';

import UserModel, { UserDocument } from '../../../../models/user.js';
import { getTokenPayload } from '../../../../utils/auth.js';

export const createToken = controller<
  RequestWithBody<CreateTokenReq>,
  ResponseWithBody<CreateTokenRes>
>(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    throw new ClientErrorUnauthorized();
  }

  const match = await user.comparePassword(req.body.password);
  if (!match) {
    throw new ClientErrorUnauthorized();
  }

  return res.status(SuccessStatusCode.SuccessCreated).send({
    token: await generateToken(getTokenPayload(user)),
  });
});

export const renewToken = controller<
  RequestWithFields<{ user: UserDocument }>,
  ResponseWithBody<CreateTokenRes>
>(async (req, res) => {
  return res
    .status(SuccessStatusCode.SuccessOK)
    .send({ token: await generateToken(getTokenPayload(req.user)) });
});
