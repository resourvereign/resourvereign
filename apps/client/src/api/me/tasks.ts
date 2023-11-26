import { UserTask as UserTaskFromServer } from '@resourvereign/common/api/me/tasks.js';
import { getRequest } from '@slangy/client/rest/request.js';
import { Jsonify } from 'type-fest';

const basePath = '/api/me/tasks';

export type UserTask = Jsonify<UserTaskFromServer>;

export const listTasks = () => {
  return getRequest<UserTask[]>(basePath);
};
