import { Intent } from '../../models/intent.js';
import { ApiModel } from '../common.js';

type IntentApiModel = ApiModel<Intent>;

export type MyIntentRes = IntentApiModel;

export type MyIntentInputReq = Omit<Intent, 'created' | 'updated' | 'user'>;

export type MyIntentsRes = MyIntentRes[];
