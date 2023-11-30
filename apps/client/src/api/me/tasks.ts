import { UserTask as UserTaskFromServer } from '@resourvereign/common/api/me/tasks.js';
import { getRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';

import { WithParsedDate } from '../../shared/types';

const basePath = '/api/me/tasks';

type RawUserTask = Jsonify<UserTaskFromServer>;

type RawIntent = RawUserTask['intent'];

type Intent = WithParsedDate<RawIntent>;

export type UserTask = WithParsedDate<Omit<RawUserTask, 'intent'>> & {
  intent: Intent;
};

const parseTask = (userTask: RawUserTask): UserTask => ({
  ...userTask,
  date: new Date(userTask.date),
  intent: {
    ...userTask.intent,
    date: new Date(userTask.intent.date),
  },
});

export const listTasks = async () => {
  return (await getRequest<UserTaskFromServer[]>(basePath)).map(parseTask);
};
