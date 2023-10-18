import { PluginStatus, UserPlugin, UserPluginInput } from '@resourvereign/common/api/me/plugins.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  RequestWithParams,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { ClientErrorNotFound } from '@slangy/server/helpers/httpError.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';

import UserPluginModel, { UserPluginDocument } from '../../../../models/userPlugin.js';
import { isPluginAvailable } from '../../../../utils/plugin.js';

export const pluginById = controller<
  RequestWithParams<{ id: string }, RequestWithFields<JwtData & { plugin: UserPluginDocument }>>
>(async (req, _, next) => {
  const plugin = await UserPluginModel.findOne({
    _id: req.params.id,
    user: req.jwtUser.id,
  });

  if (!plugin) {
    return next(new ClientErrorNotFound());
  }

  req.plugin = plugin;
  return next();
});

export const getPlugins = controller<RequestWithFields<JwtData>, ResponseWithBody<UserPlugin[]>>(
  async (req, res) => {
    const plugins = await UserPluginModel.find({ user: req.jwtUser.id });
    return res.status(SuccessStatusCode.SuccessOK).send(
      plugins.map((plugin) => ({
        ...plugin.toJSON(),
        status: isPluginAvailable(plugin.type, plugin.name)
          ? PluginStatus.enabled
          : PluginStatus.disabled,
      })),
    );
  },
);

export const createPlugin = controller<
  RequestWithBody<UserPluginInput, RequestWithFields<JwtData>>,
  ResponseWithBody<UserPlugin>
>(async (req, res) => {
  const plugin = await UserPluginModel.create({ ...req.body, user: req.jwtUser.id });

  return res.status(SuccessStatusCode.SuccessCreated).send(plugin.toJSON());
});

export const updatePlugin = controller<
  RequestWithBody<UserPluginInput, RequestWithFields<{ plugin: UserPluginDocument<never> }>>,
  ResponseWithBody<UserPlugin>
>(async (req, res) => {
  const plugin = req.plugin;

  // TODO: probably it's worth refreshing the scheduling of all intents of this plugin

  plugin.set(req.body);
  await plugin.save();

  return res.status(SuccessStatusCode.SuccessCreated).send(plugin.toJSON());
});

// TODO: probably we should handle dependant intents at least
export const deletePlugin = controller<RequestWithFields<{ plugin: UserPluginDocument<never> }>>(
  async (req, res) => {
    const plugin = req.plugin;

    await plugin.deleteOne();

    // TODO: All intents of this plugin should be deleted as well

    return res.status(SuccessStatusCode.SuccessNoContent).send();
  },
);
