import { Promisable } from 'type-fest';

import { Logger } from '../logger.js';

import { BasePlugin, DefaultPluginConfig, Result } from './index.js';

export type Book<Id> = {
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
    book(date: Date, overrides?: BookOverrides): Promisable<Result<Book<BookId>>>;
    cancel(id: BookId): Promisable<Result<boolean>>;
  }>;
};
