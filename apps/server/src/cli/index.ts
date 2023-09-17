import { lstatSync, readdirSync } from 'fs';
import { dirname, join, parse } from 'path';
import { fileURLToPath } from 'url';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commandLibraryFolder = join(__dirname, 'library');

const fullExtension = (f: string) => f.split('.').slice(1).join('.');

const instance = yargs(hideBin(process.argv));

const commands = readdirSync(commandLibraryFolder)
  .map((f) => {
    if (lstatSync(join(commandLibraryFolder, f)).isDirectory()) {
      const index = readdirSync(join(commandLibraryFolder, f)).find(
        (f) => parse(f).name === 'index',
      );
      if (index) {
        return join(f, index);
      }
    }
    return f;
  })
  .filter(
    (f) =>
      lstatSync(join(commandLibraryFolder, f)).isFile() && ['js', 'ts'].includes(fullExtension(f)),
  );

for (const command of commands) {
  const commandModule = await import(join(commandLibraryFolder, command));
  instance.command(commandModule);
}

instance.help().alias('h', 'help').demandCommand().parse();

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Caught exception:', err.stack, err);
});
