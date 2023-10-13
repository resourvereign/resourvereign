import createCrudHook from '@slangy/react/hooks/createCrudHook.js';
import createCrudStore from '@slangy/react/stores/createCrudStore.js';

import {
  MyIntent,
  createMyIntent,
  listMyIntents,
  removeMyIntent,
  updateMyIntent,
} from '../api/me/intents';

const myIntentsStore = createCrudStore<MyIntent>();

const useMyIntents = createCrudHook({
  store: myIntentsStore,
  read: listMyIntents,
  create: createMyIntent,
  update: updateMyIntent,
  remove: removeMyIntent,
});

export default useMyIntents;
