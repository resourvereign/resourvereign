import * as console from 'console';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { connectMongoose } from '@slangy/mongo/helpers/mongoose/connection.js';
import server from '@slangy/server/helpers/express/server.js';
import chalk from 'chalk';
import config from 'config';
import { gracefulShutdown } from 'node-schedule';

import api from './routes/api/index.js';
import { initializePlugins } from './utils/plugin.js';
import { initializeScheduler } from './utils/scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await initializePlugins();

console.log(new Date().toString());

await server({
  port: config.get<number>('server.port'),
  acceptJson: true,
  jsonBodyParserLimits: config.get<string>('server.bodyParserLimits.json'),
  staticsPath: resolve(__dirname, 'public'),
  spaFilePath: join(__dirname, 'public', 'index.html'),
  routes: [['/api', api]],
  init: async () => {
    await connectMongoose();
  },
})
  .then(() => {
    console.log(chalk.green(`${chalk.bold('[Init::]')} Server initialized`));

    initializeScheduler()
      .then(() => {
        console.log(chalk.green(`${chalk.bold('[Init::]')} Scheduler initialized`));
      })
      .catch((e) => {
        console.log(chalk.red(`${chalk.bold('[Init::]')} Error while creating the scheduler`, e));
      });
  })
  .catch((e) => {
    console.log(chalk.red(`${chalk.bold('[Init::]')} Error while creating the server`, e));
  });

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
  console.error('Caught exception:', err.stack, err, origin);
});

process.on('SIGINT', () => {
  gracefulShutdown().then(() => process.exit(0));
});
