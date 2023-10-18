import createCrudHook from '@slangy/react/hooks/createCrudHook.js';
import createCrudStore from '@slangy/react/stores/createCrudStore.js';

import { Intent, createIntent, listIntents, removeIntent, updateIntent } from '../api/me/intents';

const intentsStore = createCrudStore<Intent>();

const useIntents = createCrudHook({
  store: intentsStore,
  read: listIntents,
  create: createIntent,
  update: updateIntent,
  remove: removeIntent,
});

export default useIntents;
