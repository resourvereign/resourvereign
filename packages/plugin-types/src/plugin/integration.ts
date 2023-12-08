import { Promisable } from 'type-fest';

import { Logger } from '../logger.js';

import { BasePlugin, DefaultPluginConfig, Result } from './index.js';

export type Booking<Id> = {
  id: Id;
  description: string;
};

export type IntegrationPlugin<
  BookId,
  Config extends DefaultPluginConfig = DefaultPluginConfig,
  BookOverrides extends Config = Config,
> = BasePlugin & {
  initialize: (
    config: Config,
    logger: Logger,
  ) => Promise<{
    validate: () => Promisable<boolean>;
    book(date: Date, overrides?: BookOverrides): Promisable<Result<Booking<BookId>>>;
    cancel(id: BookId): Promisable<Result<boolean>>;
  }>;
};
