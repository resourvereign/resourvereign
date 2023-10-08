import { Intent } from '../../models/intent.js';
import { ApiModel } from '../common.js';

import { PluginApiModel } from './plugins.js';

type IntentApiModel = Omit<ApiModel<Intent>, 'resource'> & {
  resource: PluginApiModel;
};

export type MyIntentRes = IntentApiModel;

// TODO: Helper util to transform model references to string/ObjectId
export type MyIntentInputReq = Omit<Intent, 'created' | 'updated' | 'user' | 'resource'> & {
  resource: string;
};

export type MyIntentsRes = MyIntentRes[];
