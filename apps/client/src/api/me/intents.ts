import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  MyIntent as MyIntentFromServer,
  MyIntentInput,
} from '@resourvereign/common/api/me/intents.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';
import { Merge } from '@slangy/client/types.js';
import { Serialized } from '@slangy/client/types.js';

export type MyIntent = Merge<Serialized<MyIntentFromServer>, ReturnType<typeof parseIntent>>;

export type MyIntentUpdate = ApiModel<MyIntentInput>;
export type MyIntentCreate = MyIntentInput;

export type MyIntentData = MyIntentUpdate | MyIntentCreate;

const basePath = '/api/me/intents';

const parseIntent = (intent: Serialized<MyIntentFromServer>) => ({
  ...intent,
  date: new Date(intent.date),
});

// TODO: add pagination
export const listMyIntents = () =>
  getRequest<MyIntentFromServer[]>(basePath).then((intents) => intents.map(parseIntent));

export const createMyIntent = async (intent: MyIntentCreate) =>
  await postRequest<MyIntentInput, MyIntentFromServer>(basePath, intent).then(parseIntent);

export const updateMyIntent = async (intent: MyIntentUpdate) => {
  const { id, ...rest } = intent;
  return await putRequest<MyIntentInput, MyIntentFromServer>(`${basePath}/${id}`, rest).then(
    parseIntent,
  );
};

export const removeMyIntent = async (intent: MyIntent) => {
  await deleteRequest(`${basePath}/${intent.id}`);
};
