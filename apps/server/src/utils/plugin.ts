import { existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { PluginConfig } from '@resourvereign/common/models/userPlugin.js';
import { Plugin, PluginSchema, PluginType } from '@resourvereign/plugin-types/plugin/index.js';
import { IntegrationPlugin } from '@resourvereign/plugin-types/plugin/integration.js';
import { NotificationsPlugin } from '@resourvereign/plugin-types/plugin/notifications.js';
import { SchedulingPlugin } from '@resourvereign/plugin-types/plugin/scheduling.js';

import { IntentDocument } from '../models/intent.js';
import { UserPluginDocument } from '../models/userPlugin.js';

import { loggerForUser } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pluginPattern = 'resourvereign-plugin';

type PluginByType<T extends PluginType> = (typeof pluginRegistry)[T][string];

const pluginRegistry = {
  [PluginType.Integration]: {} as Record<
    string,
    { schema: PluginSchema; factory: Awaited<ReturnType<IntegrationPlugin<unknown>['register']>> }
  >,
  [PluginType.Notifications]: {} as Record<
    string,
    { schema: PluginSchema; factory: Awaited<ReturnType<NotificationsPlugin['register']>> }
  >,
  [PluginType.Scheduling]: {} as Record<
    string,
    { schema: PluginSchema; factory: Awaited<ReturnType<SchedulingPlugin['register']>> }
  >,
};

function findNodeModules(startDir: string) {
  let currentDir = startDir;

  while (currentDir !== '/') {
    // Add the root directory check for Windows
    const potentialPath = join(currentDir, 'node_modules');

    if (existsSync(potentialPath)) {
      return potentialPath;
    }

    currentDir = dirname(currentDir);
  }

  return null;
}

const importPlugins = async () => {
  const nodeModulesPath = findNodeModules(__dirname);

  if (!nodeModulesPath || !existsSync(nodeModulesPath)) {
    return;
  }

  for (const pluginType of Object.keys(pluginRegistry) as PluginType[]) {
    const pluginPrefix = `${pluginPattern}-${pluginType}-`;

    const pluginModules = readdirSync(nodeModulesPath)
      // Exclude hidden folders and files (like .bin)
      .filter((dirName) => !dirName.startsWith('.'))
      // Filter by pattern
      .filter((moduleName) => moduleName.startsWith(pluginPrefix));

    await Promise.all(
      pluginModules.map(async (moduleName) => {
        const pluginModule = (await import(moduleName)).default as Plugin;
        pluginRegistry[pluginType][moduleName.replace(pluginPrefix, '')] = {
          schema: pluginModule.schema,
          factory: await pluginModule.register(),
        } as PluginByType<typeof pluginType>;
      }),
    );
  }
};

export const initializePlugins = async () => {
  await importPlugins();
};

export const getPlugin = <Type extends PluginType>(type: Type, name: string) =>
  pluginRegistry[type][name] as PluginByType<Type>;

export const getAllPlugins = () =>
  Object.entries(pluginRegistry).flatMap(([type, plugins]) =>
    Object.entries(plugins).map(([name, plugin]) => ({ name, type: type as PluginType, plugin })),
  );

export const isPluginAvailable = (type: PluginType, name: string) => !!pluginRegistry[type]?.[name];

type PluginInstance<Type extends PluginType> = Type extends PluginType.Integration
  ? ReturnType<IntegrationPlugin<unknown>['register']>
  : Type extends PluginType.Notifications
    ? ReturnType<NotificationsPlugin['register']>
    : Type extends PluginType.Scheduling
      ? ReturnType<SchedulingPlugin['register']>
      : unknown;

export const getPluginInstance = async <Type extends PluginType, Config extends PluginConfig>(
  params: { type: Type; name: string; config: Config },
  userId: string,
) => {
  const plugin = getPlugin(params.type, params.name);

  if (plugin) {
    return await plugin.factory({ ...params.config }, loggerForUser(userId, params.name));
  }

  return null;
};

export const getPluginInstanceFromUserPlugin = async <
  UserPluginType extends UserPluginDocument,
  Type extends UserPluginType['type'],
>(
  userPlugin: UserPluginType,
) => {
  return (await getPluginInstance(userPlugin, userPlugin.user.toString())) as ReturnType<
    Awaited<PluginInstance<Type>>
  >;
};

export const getIntegrationInstanceFromIntent = async (intent: IntentDocument) => {
  const updatedIntent = await intent.populate('integration');

  return await getPluginInstanceFromUserPlugin(updatedIntent.integration);
};
