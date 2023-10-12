import createFetchHook from '@slangy/react/hooks/createFetchHook.js';

import { listMyLogs } from '../api/me/logs';

const useMyLogs = createFetchHook({
  fetcher: listMyLogs,
  transform: (data) => ({
    data: data?.data,
    total: data?.meta.total,
    pageSize: data?.meta.pageSize,
    page: data?.meta.page,
  }),
  swrKey: 'listMyLogs',
});

export default useMyLogs;
