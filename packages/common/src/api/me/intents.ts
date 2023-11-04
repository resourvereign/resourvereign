import { Intent as IntentModel } from '../../models/intent.js';
import { ApiModel } from '../common.js';

import { IntegrationUserPlugin } from './plugins.js';

export type Intent = Omit<ApiModel<IntentModel>, 'integration'> & {
  integration: IntegrationUserPlugin;
};

// TODO: Helper util to transform model references to string/ObjectId
export type IntentInput = Omit<Intent, 'id' | 'created' | 'updated' | 'user' | 'integration'> & {
  integration: string;
};
