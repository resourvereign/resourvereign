import { Log, LogLevel } from '@resourvereign/common/models/log.js';
import normalizeJson from '@slangy/mongo/middleware/mongoose/normalizeJson.js';
import owner from '@slangy/mongo/middleware/mongoose/owner.js';
import timestamps from '@slangy/mongo/middleware/mongoose/timestamps.js';
import { HydratedDocument, Schema, model } from '@slangy/mongo/mongoose.js';

export type LogDocument = HydratedDocument<Log>;

const pluginSchema = new Schema<Log>(
  {
    level: {
      type: String,
      required: true,
      enum: Object.values(LogLevel),
    },
    message: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { collection: 'logs', minimize: false },
)
  .plugin(owner)
  .plugin(timestamps, { update: false })
  .plugin(normalizeJson, { remove: ['password', '__v', 'user'] });

export default model('Log', pluginSchema);
