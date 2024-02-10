import { Promisable } from 'type-fest';

import { Logger } from '../logger.js';

import { BasePlugin, DefaultPluginConfig } from './index.js';

type ResultNotification = {
  integration: string;
  resource: string;
  success: boolean;
  date: Date;
};

export type NotificationsPlugin<Config extends DefaultPluginConfig = DefaultPluginConfig> =
  BasePlugin & {
    initialize: (
      config: Config,
      logger: Logger,
    ) => Promise<{
      validate: () => Promisable<boolean>;
      notify(notification: ResultNotification): Promise<boolean>;
    }>;
  };
