import { existsSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { PluginSchema, PluginType } from '@resourvereign/common/models/plugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pluginPattern = 'resourvereign-plugin';

type ResourcePlugin<Schema = PluginSchema> = {
  schema: Schema;
};

export type Plugin = ResourcePlugin;

type PluginRegistry = {
  [PluginType.Resource]: Record<string, ResourcePlugin>;
};

const pluginRegistry: PluginRegistry = {
  resource: {},
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