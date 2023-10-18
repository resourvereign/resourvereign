import createFetchHook from '@slangy/react/hooks/createFetchHook.js';

import { listLogs } from '../api/me/logs';

const useLogs = createFetchHook({
  fetcher: listLogs,
  transform: (data) => ({
    data: data?.data,
    total: data?.meta.total,
    pageSize: data?.meta.pageSize,
    page: data?.meta.page,
  }),
  swrKey: 'listLogs',
});

export default useLogs;
