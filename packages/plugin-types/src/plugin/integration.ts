import { Promisable } from 'type-fest';

import { BasePlugin, DefaultPluginConfig, PluginInstance, Result } from './index.js';

export type Booking<Id> = {
  id: Id;
  description: string;
};

type IntegrationInstance<BookId, Overrides> = PluginInstance & {
  book(date: Date, overrides?: Overrides): Promisable<Result<Booking<BookId>>>;
  cancel(booking: Booking<BookId>): Promisable<Result<boolean>>;
};

export type IntegrationPlugin<
  BookId,
  Config extends DefaultPluginConfig = DefaultPluginConfig,
  Overrides extends Config = Config,
> = BasePlugin<Config, IntegrationInstance<BookId, Overrides>>;
