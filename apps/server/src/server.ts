import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { connectMongoose } from '@slangy/mongo/helpers/mongoose/connection.js';
import server from '@slangy/server/helpers/express/server.js';
import config from 'config';

import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

server({
  port: config.get<number>('server.port'),
  acceptJson: true,
  jsonBodyParserLimits: config.get<string>('server.bodyParserLimits.json'),
  staticsPath: resolve(__dirname, 'public'),
  spaFilePath: join(__dirname, 'public', 'index.html'),
  routes: [['/', routes]],
  init: async () => {
    await connectMongoose();
  },
}).catch((e) => console.log('Error while creating the server', e));

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
  console.error('Caught exception:', err.stack, err, origin);
});
