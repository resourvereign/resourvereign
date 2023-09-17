import { CreateTokenReq, CreateTokenRes } from '@resourvereign/common/api/auth.js';
import { bodilessPutRequest, postRequest } from '@slangy/client/rest/request.js';

const basePath = '/api/auth/tokens';

export const generateToken = (email: string, password: string) =>
  postRequest<CreateTokenReq, CreateTokenRes>(basePath, {
    email,
    password,
  }).then((res) => res.token);

export const renewToken = () =>
  bodilessPutRequest<CreateTokenRes>(basePath).then((res) => res.token);
