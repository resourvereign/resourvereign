import { create } from 'zustand';

export type ItemsStore<ItemType> = {
  data: ItemType[];
  set: (items: ItemType[]) => void;
  add: (...items: ItemType[]) => void;
  remove: (itemId: ItemType) => void;
  update: (updatedItem: ItemType) => void;
};

type ItemsFactoryParams<ItemType, ItemId extends keyof ItemType> = {
  idKey?: ItemId;
};

type DefaultItemType = {
  id: unknown;
};

export const itemsStoreFactory = <
  ItemType extends DefaultItemType,
  ItemId extends keyof ItemType = 'id',
>({ idKey = 'id' as ItemId }: ItemsFactoryParams<ItemType, ItemId> = {}) =>
  create<ItemsStore<ItemType>>((setStore) => ({
    data: [],
    set: (items: ItemType[]) => {
      setStore(() => ({ data: [...items] }));
    },
    add: (...items: ItemType[]) => {
      setStore((state) => ({ data: [...state.data, ...items] }));
    },
    remove: (itemToRemove: ItemType) => {
      setStore((state) => ({
        data: state.data.filter((item) => item[idKey] !== itemToRemove[idKey]),
      }));
    },
    update: (updatedItem: ItemType) => {
      setStore((state) => ({
        data: state.data.map((item) => (item[idKey] === updatedItem[idKey] ? updatedItem : item)),
      }));
    },
  }));
