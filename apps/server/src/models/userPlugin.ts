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
import { HydratedDocument, Schema, Types, model } from 'mongoose';

type UserPluginWithUser<Config extends PluginConfig = PluginConfig> = BaseUserPlugin<Config> & {
  user: Types.ObjectId;
};

export type UserPluginDocument<Config extends PluginConfig = PluginConfig> = HydratedDocument<
  UserPluginWithUser<Config>
>;

const userPluginSchema = new Schema<UserPluginWithUser>(
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
type IntegrationUserPluginWithUser<Config extends PluginConfig = PluginConfig> =
  IntegrationUserPlugin<Config> & {
    user: Types.ObjectId;
  };

export type IntegrationUserPluginDocument<Config extends PluginConfig = PluginConfig> =
  HydratedDocument<IntegrationUserPluginWithUser<Config>>;

const IntegrationUserPluginSchema = new Schema<IntegrationUserPluginWithUser>({
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
export type NotificationsUserPluginWithUser<Config extends PluginConfig = PluginConfig> =
  NotificationsUserPlugin<Config> & {
    user: Types.ObjectId;
  };

export type NotificationsUserPluginDocument<Config extends PluginConfig = PluginConfig> =
  HydratedDocument<NotificationsUserPluginWithUser<Config>>;

const NotificationsUserPluginSchema = new Schema<NotificationsUserPluginWithUser>({});

UserPluginModel.discriminator(PluginType.Notifications, NotificationsUserPluginSchema);

// Scheduling plugin
export type SchedulingUserPluginWithUser<Config extends PluginConfig = PluginConfig> =
  SchedulingUserPlugin<Config> & {
    user: Types.ObjectId;
  };
export type SchedulingUserPluginDocument<Config extends PluginConfig = PluginConfig> =
  HydratedDocument<SchedulingUserPluginWithUser<Config>>;

const SchedulingUserPluginSchema = new Schema<SchedulingUserPluginWithUser>({});

UserPluginModel.discriminator(PluginType.Scheduling, SchedulingUserPluginSchema);

export default UserPluginModel;
