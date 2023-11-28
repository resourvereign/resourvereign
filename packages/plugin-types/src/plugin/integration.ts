import { Promisable } from 'type-fest';

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
    validate: () => Promisable<boolean>;
    book(date: Date, overrides?: BookOverrides): Promisable<boolean>;
  }>;
};
