import { Promisable } from 'type-fest';

import { Logger } from '../logger.js';

import { BasePlugin, DefaultPluginConfig } from './index.js';

export type ScheduleMiddlewareContext = {
  intent: {
    date: Date;
  };
  date?: Date;
};

export type SchedulingPlugin<Config extends DefaultPluginConfig = DefaultPluginConfig> =
  BasePlugin & {
    initialize: (
      config: Config,
      logger: Logger,
    ) => Promise<{
      validate: () => Promisable<boolean>;
      scheduleMiddleware(
        context: ScheduleMiddlewareContext,
        next: () => Promisable<void>,
      ): Promisable<void>;
    }>;
  };
