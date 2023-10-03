import { Plugin, PluginConfig, PluginType } from '@resourvereign/common/models/plugin.js';
import normalizeJson from '@slangy/mongo/middleware/mongoose/normalizeJson.js';
import owner from '@slangy/mongo/middleware/mongoose/owner.js';
import timestamps from '@slangy/mongo/middleware/mongoose/timestamps.js';
import { HydratedDocument, Schema, model } from '@slangy/mongo/mongoose.js';

export type PluginDocument<Config extends PluginConfig = PluginConfig> = HydratedDocument<
  Plugin<Config>
>;

const pluginSchema = new Schema<Plugin>(
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
    config: {
      required: true,
      type: Map,
      of: String,
      default: {},
    },
  },
  { collection: 'plugins', minimize: false },
)
  .plugin(owner)
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v', 'user'] });

export default model('Plugin', pluginSchema);
