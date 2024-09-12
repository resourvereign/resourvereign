import { connectMongoose, disconnectMongoose } from '@slangy/mongo/helpers/mongoose/connection.js';
import chalk from 'chalk';
import { BuilderCallback } from 'yargs';

import UserModel from '../../models/user.js';

interface UpdateUserOptions {
  email: string;
  password: string;
}

export const command = 'user-update <email> <password> [-a]';

export const describe = 'updates a user';

export const builder: BuilderCallback<UpdateUserOptions, UpdateUserOptions> = (yargs) =>
  yargs
    .positional('email', {
      describe: 'Email to be used',
      type: 'string',
    })
    .positional('password', {
      describe: 'Password to be used',
      type: 'string',
    });

export const handler = async (argv: UpdateUserOptions) => {
  const { email, password } = argv;

  try {
    await connectMongoose({ uri: process.env.MONGODB_URI });
    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      console.log(
        chalk.yellow(`${chalk.bold('[User:NOT_UPDATED]')} Could not find user with email ${email}`),
      );
    } else {
      user.password = password;
      await user.save();
      console.log(chalk.green(`${chalk.bold('[User:UPDATED]')} Password changed for ${email}`));
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(
        chalk.red(
          `${chalk.bold('[User:NOT_UPDATED]')} Error while updating user's password for ${email}: ${
            e.message
          }`,
        ),
      );
    }
  } finally {
    await disconnectMongoose();
  }
};
