import { Intent } from '@resourvereign/common/models/intent.js';
import normalizeJson from '@slangy/mongo/middleware/mongoose/normalizeJson.js';
import owner from '@slangy/mongo/middleware/mongoose/owner.js';
import timestamps from '@slangy/mongo/middleware/mongoose/timestamps.js';
import { HydratedDocument, Schema, model } from '@slangy/mongo/mongoose.js';

export type IntentDocument = HydratedDocument<Intent>;

const intentSchema = new Schema<Intent>(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { collection: 'intents', minimize: false },
)
  .plugin(owner)
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v', 'user'] });

export default model('Intent', intentSchema);
