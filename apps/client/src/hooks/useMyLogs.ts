import createFetchHook from '@slangy/react/hooks/createFetchHook.js';

import { listMyLogs } from '../api/me/logs';

const usePlugins = createFetchHook({
  fetcher: listMyLogs,
  swrKey: 'listMyLogs',
  dataKey: 'myLogs',
  defaultData: [],
});

export default usePlugins;
