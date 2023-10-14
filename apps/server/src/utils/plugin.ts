import { existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { PluginSchema, PluginType } from '@resourvereign/common/models/plugin.js';

import { Logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pluginPattern = 'resourvereign-plugin';

type DefaultPluginConfig = {
  [key: string]: unknown;
};

type BasePlugin<Schema = PluginSchema> = {
  schema: Schema;
};

type ResourcePlugin<
  Config extends DefaultPluginConfig = DefaultPluginConfig,
  BookOverrides extends Config = Config,
> = BasePlugin & {
  initialize: (
    config: Config,
    logger: Logger,
  ) => Promise<{
    book(date: Date, overrides?: BookOverrides): Promise<boolean>;
  }>;
};

type NotificationsPlugin<Config extends DefaultPluginConfig = DefaultPluginConfig> = BasePlugin & {
  initialize: (
    config: Config,
    logger: Logger,
  ) => Promise<{
    sendMessage(msg: string): Promise<boolean>;
  }>;
};

export type Plugin = ResourcePlugin | NotificationsPlugin;

type PluginRegistry = {
  [PluginType.Resource]: Record<string, ResourcePlugin>;
  [PluginType.Notifications]: Record<string, ResourcePlugin>;
};

const pluginRegistry: PluginRegistry = {
  resource: {},
  notifications: {},
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
        pluginRegistry[pluginType][moduleName.replace(pluginPrefix, '')] = (await import(
          moduleName
        )) as ResourcePlugin;
      }),
    );
  }
};

export const initializePlugins = async () => {
  await importPlugins();
};

export const getPluginsByType = (type: PluginType) => Object.values(pluginRegistry[type]);

export const getPlugin = (type: PluginType, name: string) => pluginRegistry[type][name];

export const getAllPlugins = () =>
  Object.entries(pluginRegistry).flatMap(([type, plugins]) =>
    Object.entries(plugins).map(([name, plugin]) => ({ name, type: type as PluginType, plugin })),
  );

export const isPluginAvailable = (type: PluginType, name: string) => !!pluginRegistry[type][name];
