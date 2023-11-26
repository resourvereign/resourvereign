import createFetchHook from '@slangy/react/hooks/createFetchHook.js';

import { listTasks } from '../api/me/tasks';

const useLogs = createFetchHook({
  fetcher: listTasks,
  swrKey: 'listTasks',
});

export default useLogs;
