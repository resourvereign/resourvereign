import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  MyIntentInputReq,
  MyIntentRes,
  MyIntentsRes,
} from '@resourvereign/common/api/me/intents.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';

export type MyIntent = MyIntentRes;

export type MyIntentUpdateInput = ApiModel<MyIntentInputReq>;
export type MyIntentCreateInput = MyIntentInputReq;

export type MyIntentInput = MyIntentUpdateInput | MyIntentCreateInput;

const basePath = '/api/me/intents';

// TODO: Raw type from server without date parsing?
const parseIntent = (intent: MyIntent) => ({
  ...intent,
  date: new Date(intent.date),
});

// TODO: add pagination
export const listMyIntents = () =>
  getRequest<MyIntentsRes>(basePath).then((intents) => intents.map(parseIntent));

export const createMyIntent = async (intent: MyIntentCreateInput) =>
  await postRequest<MyIntentInputReq, MyIntentRes>(basePath, intent).then(parseIntent);

export const updateMyIntent = async (intent: MyIntentUpdateInput) => {
  const { id, ...rest } = intent;
  return await putRequest<MyIntentInputReq, MyIntentRes>(`${basePath}/${id}`, rest).then(
    parseIntent,
  );
};

export const removeMyIntent = async (intent: MyIntent) => {
  await deleteRequest(`${basePath}/${intent.id}`);
};
