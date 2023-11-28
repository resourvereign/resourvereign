import { Promisable } from 'type-fest';

import { Logger } from '../logger.js';

import { BasePlugin, DefaultPluginConfig } from './index.js';

export type NotificationsPlugin<Config extends DefaultPluginConfig = DefaultPluginConfig> =
  BasePlugin & {
    initialize: (
      config: Config,
      logger: Logger,
    ) => Promise<{
      validate: () => Promisable<boolean>;
      notify(msg: string): Promise<boolean>;
    }>;
  };
