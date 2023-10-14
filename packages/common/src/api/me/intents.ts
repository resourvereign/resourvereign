import { Intent } from '../../models/intent.js';
import { ApiModel } from '../common.js';

import { MyPluginWithoutStatus } from './plugins.js';

export type MyIntent = Omit<ApiModel<Intent>, 'integration'> & {
  integration: MyPluginWithoutStatus;
};

// TODO: Helper util to transform model references to string/ObjectId
export type MyIntentInput = Omit<Intent, 'created' | 'updated' | 'user' | 'integration'> & {
  integration: string;
};
