import {
  PluginStatus,
  UserPluginInput,
  UserPluginWithStatus,
} from '@resourvereign/common/api/me/plugins.js';
import { PluginType } from '@resourvereign/common/models/plugin.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  RequestWithParams,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { ClientErrorNotFound } from '@slangy/server/helpers/httpError.js';
import { ClientErrorStatusCode, SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';

import IntentModel from '../../../../models/intent.js';
import UserPluginModel, { UserPluginDocument } from '../../../../models/userPlugin.js';
import { getPluginInstance, isPluginAvailable } from '../../../../utils/plugin.js';
import { cancelIntentScheduling, scheduleIntent } from '../../../../utils/scheduler.js';

export const pluginById = controller<
  RequestWithParams<{ id: string }, RequestWithFields<JwtData & { plugin: UserPluginDocument }>>
>(async (req, _, next) => {
  const plugin = (await UserPluginModel.findOne({
    _id: req.params.id,
    user: req.jwtUser.id,
    // TODO: Investigate why type assertion is needed and findOne return type is not compatible with UserPluginDocument
  })) as UserPluginDocument;

  if (!plugin) {
    return next(new ClientErrorNotFound());
  }

  req.plugin = plugin;
  return next();
});

const pluginResponse = async (plugin: UserPluginDocument): Promise<UserPluginWithStatus> => {
  const status = isPluginAvailable(plugin.type, plugin.name)
    ? PluginStatus.enabled
    : PluginStatus.disabled;

  if (plugin.type === PluginType.Integration) {
    await plugin.populate('addons');
  }

  return {
    ...plugin.toJSON(),
    status,
  };
};

export const getPlugins = controller<
  RequestWithFields<JwtData>,
  ResponseWithBody<UserPluginWithStatus[]>
>(async (req, res) => {
  // TODO: Investigate why type assertion is needed and findOne return type is not compatible with UserPluginDocument
  const plugins = (await UserPluginModel.find({ user: req.jwtUser.id })) as UserPluginDocument[];
  return res
    .status(SuccessStatusCode.SuccessOK)
    .send(await Promise.all(plugins.map(pluginResponse)));
});

export const createPlugin = controller<
  RequestWithBody<UserPluginInput, RequestWithFields<JwtData>>,
  ResponseWithBody<UserPluginWithStatus>
>(async (req, res) => {
  const instance = await getPluginInstance(req.body, req.jwtUser.id);
  const result = await instance?.validate();
  if (!result) {
    return res.status(ClientErrorStatusCode.ClientErrorBadRequest).send();
  }

  const plugin = (await UserPluginModel.create({
    ...req.body,
    user: req.jwtUser.id,
    // TODO: Investigate why type assertion is needed and findOne return type is not compatible with UserPluginDocument
  })) as UserPluginDocument;

  return res.status(SuccessStatusCode.SuccessCreated).send(await pluginResponse(plugin));
});

export const updatePlugin = controller<
  RequestWithBody<UserPluginInput, RequestWithFields<{ plugin: UserPluginDocument }>>,
  ResponseWithBody<UserPluginWithStatus>
>(async (req, res) => {
  const plugin = req.plugin;

  const instance = await getPluginInstance(req.body, plugin.user.toString());
  const result = await instance?.validate();
  if (!result) {
    return res.status(ClientErrorStatusCode.ClientErrorBadRequest).send();
  }

  plugin.set(req.body);
  await plugin.save();

  // TODO: Extend update to other types of plugins
  if (plugin.type === PluginType.Integration) {
    const pluginIntents = await IntentModel.find({
      integration: plugin._id,
    });

    pluginIntents.forEach((intent) => {
      scheduleIntent(intent);
    });
  }

  return res.status(SuccessStatusCode.SuccessCreated).send(await pluginResponse(plugin));
});

// TODO: probably we should handle dependant intents at least
export const deletePlugin = controller<RequestWithFields<{ plugin: UserPluginDocument<never> }>>(
  async (req, res) => {
    const plugin = req.plugin;

    // TODO: Consider clearing usage of extensions for other types of plugins
    if (plugin.type === PluginType.Integration) {
      const pluginIntents = await IntentModel.find({
        integration: plugin._id,
      });

      await Promise.all(
        pluginIntents.map(async (intent) => {
          cancelIntentScheduling(intent);
          await intent.deleteOne();
        }),
      );
    }

    await plugin.deleteOne();

    return res.status(SuccessStatusCode.SuccessNoContent).send();
  },
);
