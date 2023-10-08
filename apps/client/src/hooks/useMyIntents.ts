import {
  MyIntent,
  MyIntentCreateInput,
  MyIntentUpdateInput,
  createMyIntent,
  listMyIntents,
  removeMyIntent,
  updateMyIntent,
} from '../api/me/intents';
import { itemsStoreFactory } from '../stores/itemsStore';

import createDataHook from './useData';

const myIntentsStore = itemsStoreFactory<MyIntent>({});

const useMyIntents = createDataHook<MyIntent, MyIntentCreateInput, MyIntentUpdateInput>({
  key: 'myIntents',
  store: myIntentsStore,
  fetcher: listMyIntents,
  creator: createMyIntent,
  updater: updateMyIntent,
  remover: removeMyIntent,
});

export default useMyIntents;
