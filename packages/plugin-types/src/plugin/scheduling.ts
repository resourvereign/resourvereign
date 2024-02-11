import { Promisable } from 'type-fest';

import { BasePlugin, DefaultPluginConfig, PluginInstance } from './index.js';

export enum SchedulingReason {
  intentCreation = 'intentCreation',
  intentFailure = 'intentFailure',
}

export type ScheduleMiddlewareContext = {
  reason: SchedulingReason;
  intent: {
    date: Date;
  };
  date?: Date;
};

type SchedulingInstance = PluginInstance & {
  scheduleMiddleware(
    context: ScheduleMiddlewareContext,
    next: () => Promisable<void>,
  ): Promisable<void>;
};

export type SchedulingPlugin<Config extends DefaultPluginConfig = DefaultPluginConfig> = BasePlugin<
  Config,
  SchedulingInstance
>;
