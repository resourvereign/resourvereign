import { Logger } from '../logger.js';

import { BasePlugin, DefaultPluginConfig } from './index.js';

export type NotificationsPlugin<Config extends DefaultPluginConfig = DefaultPluginConfig> =
  BasePlugin & {
    initialize: (
      config: Config,
      logger: Logger,
    ) => Promise<{
      notify(msg: string): Promise<boolean>;
    }>;
  };
