import { Booking } from '@resourvereign/plugin-types/plugin/integration.js';

import { Intent as IntentModel } from '../../models/intent.js';
import { ApiModel } from '../common.js';

import { IntegrationUserPlugin } from './plugins.js';

export type Intent = Omit<ApiModel<IntentModel>, 'integration'> & {
  integration: IntegrationUserPlugin;
  booking: Omit<IntentModel['booking'], 'id'> | undefined;
};

// TODO: Helper util to transform model references to string/ObjectId
export type IntentInput = Omit<
  Intent,
  'id' | 'created' | 'updated' | 'user' | 'integration' | 'booking'
> & {
  integration: string;
};

export type IntentDeletion = {
  booking: Omit<Booking<unknown>, 'id'> | undefined;
  cancelled: boolean;
};
