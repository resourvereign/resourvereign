import { PluginType } from '@resourvereign/common/models/plugin.js';
import { ScheduleMiddlewareContext } from '@resourvereign/plugin-types/plugin/scheduling.js';
import { addSeconds, endOfDay, startOfDay, subDays } from 'date-fns';
import { Job, scheduleJob } from 'node-schedule';

import IntentModel, { IntentDocument } from '../models/intent.js';
import {
  NotificationsUserPluginDocument,
  SchedulingUserPluginDocument,
} from '../models/userPlugin.js';

import { MiddlewareChain } from './middlewareChain.js';
import { getPluginInstanceFromUserPlugin } from './plugin.js';

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

  return !intent.satisfied && intent.date >= todayStartOfDay;
};

const getNextDate = async (intent: IntentDocument) => {
  await intent.populate('integration');
  await intent.integration.populate('addons');

  const now = new Date();

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
    intent,
    date: now,
  };

  await middlewareChain.execute(context);

  // Guarantee that date is in the future
  return context.date
    ? new Date(
        Math.max(context.date.getTime(), addSeconds(new Date(), minSecondsInFuture).getTime()),
      )
    : undefined;
};

const getUserTasksMap = (userId: string) => {
  if (!userTasks.has(userId)) {
    userTasks.set(userId, new Map());
  }

  return userTasks.get(userId)!;
};

export const scheduleIntent = async (intent: IntentDocument) => {
  const tasks = getUserTasksMap(intent.user.toString());

  // Cancel previous schedule if exists
  if (tasks.has(intent.id)) {
    const task = tasks.get(intent.id)!;
    task.disposer();
  }

  if (intent.satisfied || !isIntentSchedulable(intent)) {
    return;
  }

  const nextDate = await getNextDate(intent);

  if (nextDate) {
    // Schedule job
    const job = scheduleJob(nextDate, async () => {
      const updatedIntent = await IntentModel.findOne({ _id: intent.id })
        .populate('integration')
        .exec();

      // If intent is not found, is satisfied or is scheduled for the past cancel job
      if (!updatedIntent || !isIntentSchedulable(intent)) {
        disposer();
        return;
      }

      const integrationInstance = await getPluginInstanceFromUserPlugin(updatedIntent.integration);

      if (integrationInstance) {
        const result = await integrationInstance.book(intent.date);

        if (result) {
          updatedIntent.satisfied = true;
          await updatedIntent.save();

          // Loop through notification plugins and send notification
          await updatedIntent.integration.populate('addons');
          for (const notificationPlugin of updatedIntent.integration.addons.filter(
            (addon) => addon.type === PluginType.Notifications,
          ) as NotificationsUserPluginDocument[]) {
            const notificationInstance = await getPluginInstanceFromUserPlugin(notificationPlugin);

            // TODO: improve notification message
            await notificationInstance?.notify(
              `${intent.integration.label} successfully booked for ${intent.date}`,
            );
          }
          disposer();
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

export const cancelIntent = (intent: IntentDocument) => {
  const tasks = getUserTasksMap(intent.user.toString());
  const task = tasks.get(intent.id);

  if (task) {
    task.disposer();
  }
};

export const initializeScheduler = async () => {
  // Filter intents that are not satisfied and are scheduled for the future
  const yesterdayEndOfDay = endOfDay(subDays(new Date(), 1));
  const intents = await IntentModel.find({ date: { $gte: yesterdayEndOfDay }, satisfied: false })
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
