import { PluginType } from '@resourvereign/common/models/plugin.js';
import {
  ScheduleMiddlewareContext,
  SchedulingReason,
} from '@resourvereign/plugin-types/plugin/scheduling.js';
import { addSeconds, endOfDay, startOfDay, subDays } from 'date-fns';
import { Job, scheduleJob } from 'node-schedule';

import IntentModel, { IntentDocument } from '../models/intent.js';
import {
  NotificationsUserPluginDocument,
  SchedulingUserPluginDocument,
} from '../models/userPlugin.js';

import { fromTimezone, toTimezone } from './date.js';
import { MiddlewareChain } from './middlewareChain.js';
import { getIntegrationInstanceFromIntent, getPluginInstanceFromUserPlugin } from './plugin.js';

type Task = {
  date: Date;
  disposer: () => void;
  job: Job;
  intent: IntentDocument;
};

const userTasks = new Map<string, Map<string, Task>>();

const minSecondsInFuture = 1;

const isIntentSchedulable = (intent: IntentDocument) => {
  const todayStartOfDay = startOfDay(new Date());

  return !intent.booking && intent.date >= todayStartOfDay;
};

const getNextDate = async (intent: IntentDocument, reason = SchedulingReason.intentCreation) => {
  await intent.populate('user integration');
  await intent.integration.populate('addons');

  const now = toTimezone(new Date(), intent.user.timezone);

  const middlewareChain = new MiddlewareChain<ScheduleMiddlewareContext>();

  // Loop through scheduling plugins and apply middleware
  for (const notificationPlugin of intent.integration.addons.filter(
    (addon) => addon.type === PluginType.Scheduling,
  ) as SchedulingUserPluginDocument[]) {
    const schedulingInstance = await getPluginInstanceFromUserPlugin(notificationPlugin);

    if (schedulingInstance) {
      middlewareChain.use(schedulingInstance.scheduleMiddleware);
    }
  }

  const context: ScheduleMiddlewareContext = {
    reason,
    intent: {
      date: toTimezone(intent.date, intent.user.timezone),
    },
    date: now,
  };

  await middlewareChain.execute(context);

  // Guarantee that date is in the future
  return context.date
    ? new Date(
        Math.max(
          fromTimezone(context.date, intent.user.timezone).getTime(),
          addSeconds(new Date(), minSecondsInFuture).getTime(),
        ),
      )
    : undefined;
};

const getUserTasksMap = (userId: string) => {
  if (!userTasks.has(userId)) {
    userTasks.set(userId, new Map());
  }

  return userTasks.get(userId)!;
};

export const scheduleIntent = async (
  intent: IntentDocument,
  reason = SchedulingReason.intentCreation,
) => {
  const tasks = getUserTasksMap(intent.user.toString());

  // Cancel previous schedule if exists
  if (tasks.has(intent.id)) {
    const task = tasks.get(intent.id)!;
    task.disposer();
  }

  if (intent.booking || !isIntentSchedulable(intent)) {
    return;
  }

  const nextDate = await getNextDate(intent, reason);

  if (nextDate) {
    // Schedule job
    const job = scheduleJob(nextDate, async () => {
      const updatedIntent = await IntentModel.findOne({ _id: intent.id });

      // If intent is not found, is satisfied or is scheduled for the past cancel job
      if (!updatedIntent || !isIntentSchedulable(intent)) {
        disposer();
        return;
      }

      const integrationInstance = await getIntegrationInstanceFromIntent(updatedIntent);

      if (integrationInstance) {
        const [result] = await integrationInstance.book(intent.date);

        if (result) {
          updatedIntent.booking = result;
          await updatedIntent.save();

          // Loop through notification plugins and send notification
          await updatedIntent.integration.populate('addons');
          for (const notificationPlugin of updatedIntent.integration.addons.filter(
            (addon) => addon.type === PluginType.Notifications,
          ) as NotificationsUserPluginDocument[]) {
            const notificationInstance = await getPluginInstanceFromUserPlugin(notificationPlugin);

            await notificationInstance?.notify({
              integration: intent.integration.label,
              resource: result.description,
              success: true,
              date: intent.date,
            });
          }
          disposer();
        } else {
          disposer();
          // Schedule again
          await scheduleIntent(intent, SchedulingReason.intentFailure);
        }
      }
    });

    const disposer = () => {
      // cancel job
      if (job) {
        job.cancel();
      }

      // delete from map
      tasks.delete(intent.id);
    };

    if (job) {
      // Register disposer for intent
      tasks.set(intent.id, {
        date: nextDate,
        disposer,
        job,
        intent,
      });
    }
  }
};

export const cancelIntentScheduling = (intent: IntentDocument) => {
  const tasks = getUserTasksMap(intent.user.toString());
  const task = tasks.get(intent.id);

  if (task) {
    task.disposer();
  }
};

export const initializeScheduler = async () => {
  // Filter intents that are not satisfied and are scheduled for the future
  const yesterdayEndOfDay = endOfDay(subDays(new Date(), 1));
  const intents = await IntentModel.find({ date: { $gte: yesterdayEndOfDay }, book: null })
    .populate('integration')
    .exec();

  // Schedule intents
  intents.forEach((intent) => {
    scheduleIntent(intent);
  });
};

export const getUserTasks = (userId: string) => {
  const tasks = getUserTasksMap(userId);

  return Array.from(tasks.values()).map((task) => {
    const { date, intent } = task;
    return { date, intent };
  });
};
