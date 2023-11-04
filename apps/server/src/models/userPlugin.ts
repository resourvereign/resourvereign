import { PluginType } from '@resourvereign/common/models/plugin.js';
import {
  BaseUserPlugin,
  IntegrationUserPlugin,
  NotificationsUserPlugin,
  PluginConfig,
  SchedulingUserPlugin,
} from '@resourvereign/common/models/userPlugin.js';
import normalizeJson from '@slangy/mongo/middleware/mongoose/normalizeJson.js';
import owner from '@slangy/mongo/middleware/mongoose/owner.js';
import timestamps from '@slangy/mongo/middleware/mongoose/timestamps.js';
import { HydratedDocument, Schema, model } from 'mongoose';

export type UserPluginDocument<Config extends PluginConfig = PluginConfig> = HydratedDocument<
  BaseUserPlugin<Config>
>;

const userPluginSchema = new Schema<BaseUserPlugin>(
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
      type: Object,
      default: {},
    },
  },
  { collection: 'userPlugins', minimize: false, discriminatorKey: 'type' },
)
  .plugin(owner)
  .plugin(timestamps)
  .plugin(normalizeJson, { remove: ['password', '__v', 'user'] });

const UserPluginModel = model('UserPlugin', userPluginSchema);

// Integration plugin
export type IntegrationUserPluginDocument<Config extends PluginConfig = PluginConfig> =
  HydratedDocument<IntegrationUserPlugin<Config>>;

const IntegrationUserPluginSchema = new Schema({
  color: {
    type: String,
    required: true,
    trim: true,
  },
  addons: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserPlugin',
    },
  ],
});

UserPluginModel.discriminator(PluginType.Integration, IntegrationUserPluginSchema);

// Notifications plugin
export type NotificationsPluginDocument<Config extends PluginConfig = PluginConfig> =
  HydratedDocument<NotificationsUserPlugin<Config>>;

const NotificationsUserPluginSchema = new Schema({});

UserPluginModel.discriminator(PluginType.Notifications, NotificationsUserPluginSchema);

// Scheduling plugin
export type SchedulingPluginDocument<Config extends PluginConfig = PluginConfig> = HydratedDocument<
  SchedulingUserPlugin<Config>
>;

const SchedulingUserPluginSchema = new Schema({});

UserPluginModel.discriminator(PluginType.Scheduling, SchedulingUserPluginSchema);

export default UserPluginModel;
