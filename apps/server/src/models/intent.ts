import { Intent } from '@resourvereign/common/models/intent.js';
import { Book } from '@resourvereign/plugin-types/plugin/integration.js';
import normalizeJson from '@slangy/mongo/middleware/mongoose/normalizeJson.js';
import owner from '@slangy/mongo/middleware/mongoose/owner.js';
import timestamps from '@slangy/mongo/middleware/mongoose/timestamps.js';
import { HydratedDocument, Schema, Types, model } from 'mongoose';

import { UserDocument } from './user.js';
import { IntegrationUserPluginDocument } from './userPlugin.js';

type IntentWithUser = Omit<Intent, 'integration'> & {
  // TODO: This needs to be reviewed as only populated instances will match the type of user and integration
  user: UserDocument;
  integration: IntegrationUserPluginDocument;
};

export type IntentDocument = HydratedDocument<IntentWithUser>;

const BookSchema = new Schema<Book<unknown>>(
  {
    id: Schema.Types.Mixed, // Allows 'id' to be any type
    description: String,
  },
  { _id: false },
);

const intentSchema = new Schema<IntentWithUser>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    integration: {
      type: Types.ObjectId,
      required: true,
      ref: 'UserPlugin',
      index: true,
    },
    book: {
      type: BookSchema,
      default: null,
    },
  },
  { collection: 'intents', minimize: false },
)
  .plugin(owner)
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v', 'user'] });

// TODO: Is the type hint necessary?
export default model<IntentWithUser>('Intent', intentSchema);
