import { ApiModel } from '@resourvereign/common/api/common.js';
import {
  IntentDeletion as IntentDeletionFromServer,
  Intent as IntentFromServer,
  IntentInput,
} from '@resourvereign/common/api/me/intents.js';
import { deleteRequest, getRequest, postRequest, putRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';

import { WithParsedDate } from '../../shared/types';

type RawIntent = Jsonify<IntentFromServer>;

export type Intent = WithParsedDate<RawIntent>;

type IntentDeletion = Jsonify<IntentDeletionFromServer>;

export type IntentUpdate = ApiModel<IntentInput>;
export type IntentCreate = IntentInput;

export type IntentData = IntentUpdate | IntentCreate;

const basePath = '/api/me/intents';

const parseIntent = (intent: RawIntent) => ({
  ...intent,
  date: new Date(intent.date),
});

export const listIntents = (from: Date, to: Date): Promise<Intent[]> => {
  const searchParams = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });

  return getRequest<IntentFromServer[]>(`${basePath}?${searchParams.toString()}`).then((intents) =>
    intents.map(parseIntent),
  );
};

export const createIntent = async (intent: IntentCreate): Promise<Intent> =>
  await postRequest<IntentInput, IntentFromServer>(basePath, intent).then(parseIntent);

export const updateIntent = async (intent: IntentUpdate): Promise<Intent> => {
  const { id, ...rest } = intent;
  return await putRequest<IntentInput, IntentFromServer>(`${basePath}/${id}`, rest).then(
    parseIntent,
  );
};

export const removeIntent = async (id: Intent['id']): Promise<IntentDeletion> => {
  return await deleteRequest<IntentDeletionFromServer>(`${basePath}/${id}`);
};
