import { existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { PluginType } from '@resourvereign/plugin-types/plugin/index.js';
import { IntegrationPlugin } from '@resourvereign/plugin-types/plugin/integration.js';
import { NotificationsPlugin } from '@resourvereign/plugin-types/plugin/notifications.js';
import { SchedulingPlugin } from '@resourvereign/plugin-types/plugin/scheduling.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pluginPattern = 'resourvereign-plugin';

type PluginByType<T extends PluginType> = (typeof pluginRegistry)[T][string] | undefined;

const pluginRegistry = {
  [PluginType.Integration]: {} as Record<string, IntegrationPlugin>,
  [PluginType.Notifications]: {} as Record<string, NotificationsPlugin>,
  [PluginType.Scheduling]: {} as Record<string, SchedulingPlugin>,
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
        )) as IntegrationPlugin;
      }),
    );
  }
};

export const initializePlugins = async () => {
  await importPlugins();
};

export const getPluginsByType = (type: PluginType) => Object.values(pluginRegistry[type]);

export const getPlugin = <Type extends PluginType>(type: Type, name: string) =>
  pluginRegistry[type][name] as PluginByType<Type>;

export const getAllPlugins = () =>
  Object.entries(pluginRegistry).flatMap(([type, plugins]) =>
    Object.entries(plugins).map(([name, plugin]) => ({ name, type: type as PluginType, plugin })),
  );

export const isPluginAvailable = (type: PluginType, name: string) => !!pluginRegistry[type]?.[name];
