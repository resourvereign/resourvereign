import { PluginType } from '@resourvereign/common/models/plugin.js';
import { PluginConfig, UserPlugin } from '@resourvereign/common/models/userPlugin.js';
import normalizeJson from '@slangy/mongo/middleware/mongoose/normalizeJson.js';
import owner from '@slangy/mongo/middleware/mongoose/owner.js';
import timestamps from '@slangy/mongo/middleware/mongoose/timestamps.js';
import { HydratedDocument, Schema, model } from 'mongoose';

export type UserPluginDocument<Config extends PluginConfig = PluginConfig> = HydratedDocument<
  UserPlugin<Config>
>;

const userPluginSchema = new Schema<UserPlugin>(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(PluginType),
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    config: {
      required: true,
      type: Object,
      default: {},
    },
  },
  { collection: 'userPlugins', minimize: false },
)
  .plugin(owner)
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v', 'user'] });

export default model('UserPlugin', userPluginSchema);
