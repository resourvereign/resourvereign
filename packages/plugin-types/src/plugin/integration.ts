import { Logger } from '../logger.js';

import { BasePlugin, DefaultPluginConfig } from './index.js';

export type IntegrationPlugin<
  Config extends DefaultPluginConfig = DefaultPluginConfig,
  BookOverrides extends Config = Config,
> = BasePlugin & {
  initialize: (
    config: Config,
    logger: Logger,
  ) => Promise<{
    book(date: Date, overrides?: BookOverrides): Promise<boolean>;
  }>;
};
