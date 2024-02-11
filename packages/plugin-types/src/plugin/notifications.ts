import { BasePlugin, DefaultPluginConfig, PluginInstance } from './index.js';

export type ResultNotification = {
  integration: string;
  resource: string;
  success: boolean;
  date: Date;
};

type NotificationInstance = PluginInstance & {
  notify(notification: ResultNotification): Promise<boolean>;
};

export type NotificationsPlugin<Config extends DefaultPluginConfig = DefaultPluginConfig> =
  BasePlugin<Config, NotificationInstance>;
