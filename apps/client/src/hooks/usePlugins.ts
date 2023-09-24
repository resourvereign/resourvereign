import useSWR from 'swr';

import { listPlugins } from '../api/plugins';

const usePlugins = () => {
  const { data, ...rest } = useSWR('listPlugins', listPlugins);
  return {
    exercises: data,
    ...rest,
  };
};

export default usePlugins;
