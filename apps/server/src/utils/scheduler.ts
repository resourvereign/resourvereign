import { PluginType } from '@resourvereign/common/models/plugin.js';
import config from 'config';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { scheduleJob } from 'node-schedule';

import IntentModel, { IntentDocument } from '../models/intent.js';

import { loggerForUser } from './logger.js';
import { getPlugin } from './plugin.js';

const schedulerCron = config.get<string>('scheduler.cron');

const jobs = new Map<string, () => void>();

const isIntentSchedulable = (intent: IntentDocument) => {
  const todayStartOfDay = startOfDay(new Date());

  return !intent.satisfied && intent.date >= todayStartOfDay;
};

export const scheduleIntent = (intent: IntentDocument) => {
  // Cancel previous schedule if exists
  if (jobs.has(intent.id)) {
    const jobDisposer = jobs.get(intent.id)!;
    jobDisposer();
  }

  if (intent.satisfied || !isIntentSchedulable(intent)) {
    return;
  }

  // Schedule job
  const job = scheduleJob(schedulerCron, async () => {
    const updatedIntent = await IntentModel.findOne({ _id: intent.id })
      .populate('integration')
      .exec();

    // If intent is not found, is satisfied or is scheduled for the past cancel job
    if (!updatedIntent || !isIntentSchedulable(intent)) {
      disposer();
      return;
    }

    const integrationPlugin = getPlugin(PluginType.Integration, updatedIntent.integration.name);

    if (integrationPlugin) {
      const instance = await integrationPlugin.initialize(
        { ...intent.integration.config },
        loggerForUser(intent.user.toString()),
      );

      const result = await instance.book(intent.date);
      if (result) {
        updatedIntent.satisfied = true;
        await updatedIntent.save();
        disposer();
      }
    }
  });

  const disposer = () => {
    // cancel job
    job.cancel();

    // delete from map
    jobs.delete(intent.id);
  };

  // Register disposer for intent
  jobs.set(intent.id, disposer);
};

export const cancel = (intent: IntentDocument) => {
  const jobDisposer = jobs.get(intent.id);

  if (jobDisposer) {
    jobDisposer();
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
