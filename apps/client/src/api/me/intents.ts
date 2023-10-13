import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  MyIntent as MyIntentFromServer,
  MyIntentInput,
} from '@resourvereign/common/api/me/intents.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';
// TODO: Can type-fest be used instead (Merge and Jsonify)?
import { Merge, Serialized } from '@slangy/client/types.js';

export type MyIntent = Merge<Serialized<MyIntentFromServer>, ReturnType<typeof parseIntent>>;

export type MyIntentUpdate = ApiModel<MyIntentInput>;
export type MyIntentCreate = MyIntentInput;

export type MyIntentData = MyIntentUpdate | MyIntentCreate;

const basePath = '/api/me/intents';

const parseIntent = (intent: Serialized<MyIntentFromServer>) => ({
  ...intent,
  date: new Date(intent.date),
});

export const listMyIntents = (month: Date) => {
  const searchParams = new URLSearchParams({ month: month.toISOString() });

  return getRequest<MyIntentFromServer[]>(`${basePath}?${searchParams.toString()}`).then(
    (intents) => intents.map(parseIntent),
  );
};

export const createMyIntent = async (intent: MyIntentCreate) =>
  await postRequest<MyIntentInput, MyIntentFromServer>(basePath, intent).then(parseIntent);

export const updateMyIntent = async (intent: MyIntentUpdate) => {
  const { id, ...rest } = intent;
  return await putRequest<MyIntentInput, MyIntentFromServer>(`${basePath}/${id}`, rest).then(
    parseIntent,
  );
};

export const removeMyIntent = async (id: MyIntent['id']) => {
  await deleteRequest(`${basePath}/${id}`);
};
