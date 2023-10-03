import useSWR from 'swr';

import { ItemsStore } from '../stores/itemsStore';

type UseDataFactoryParams<ItemType, CreateItemType, UpdateItemType> = {
  key: string;
  store: () => ItemsStore<ItemType>;
  fetcher: () => Promise<ItemType[]>;
  creator: (item: CreateItemType) => Promise<ItemType>;
  updater: (item: UpdateItemType) => Promise<ItemType>;
  remover: (item: ItemType) => Promise<void>;
};

function useDataFactory<ItemType, CreateItemType, UpdateItemType>({
  key,
  store,
  fetcher,
  creator,
  remover,
  updater,
}: UseDataFactoryParams<ItemType, CreateItemType, UpdateItemType>) {
  return function useData() {
    const { data, set, add: addItem, update: updateItem, remove: removeItem } = store();

    const { isLoading: swrIsLoading, error: swrError } = useSWR(key, async () => {
      if (data.length === 0) {
        const fetchData = await fetcher();
        set(fetchData); // setting data in ItemsStore
        return fetchData;
      } else {
        return data;
      }
    });

    return {
      data: data,
      error: swrError,
      isLoading: swrIsLoading,
      async add(item: CreateItemType) {
        const newItem = await creator(item);
        addItem(newItem);
      },
      async remove(item: ItemType) {
        await remover(item);
        removeItem(item);
      },
      async update(item: UpdateItemType) {
        const updatedItem = await updater(item);
        updateItem(updatedItem);
      },
    };
  };
}

export default useDataFactory;
