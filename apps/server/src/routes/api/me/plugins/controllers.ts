import { MyPluginInputReq, MyPluginsRes, PluginStatus } from '@resourvereign/common/api/me.js';
import controller, {
  RequestWithBody,
  RequestWithFields,
  RequestWithParams,
  ResponseWithBody,
} from '@slangy/server/helpers/express/controller.js';
import { ClientErrorNotFound } from '@slangy/server/helpers/httpError.js';
import { SuccessStatusCode } from '@slangy/server/http.js';
import { JwtData } from '@slangy/server/middleware/express/auth/jwt.js';

import PluginModel, { PluginDocument } from '../../../../models/plugin.js';
import { isPluginAvailable } from '../../../../utils/plugin.js';

export const pluginById = controller<
  RequestWithParams<{ id: string }, RequestWithFields<JwtData & { plugin: PluginDocument }>>
>(async (req, _, next) => {
  const plugin = await PluginModel.findOne({
    _id: req.params.id,
    user: req.jwtUser.id,
  });

  if (!plugin) {
    return next(new ClientErrorNotFound());
  }

  req.plugin = plugin;
  return next();
});

export const getPlugins = controller<RequestWithFields<JwtData>, ResponseWithBody<MyPluginsRes>>(
  async (req, res) => {
    const plugins = await PluginModel.find({ user: req.jwtUser.id });
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
  RequestWithBody<MyPluginInputReq, RequestWithFields<JwtData>>,
  ResponseWithBody<MyPluginsRes>
>(async (req, res) => {
  const plugin = await PluginModel.create({ ...req.body, user: req.jwtUser.id });

  return res.status(SuccessStatusCode.SuccessCreated).send(plugin.toJSON());
});

export const updatePlugin = controller<
  RequestWithBody<MyPluginInputReq, RequestWithFields<{ plugin: PluginDocument<never> }>>,
  ResponseWithBody<MyPluginsRes>
>(async (req, res) => {
  const plugin = req.plugin;

  plugin.set(req.body);
  await plugin.save();

  return res.status(SuccessStatusCode.SuccessCreated).send(plugin.toJSON());
});

export const deletePlugin = controller<RequestWithFields<{ plugin: PluginDocument<never> }>>(
  async (req, res) => {
    const plugin = req.plugin;

    await plugin.deleteOne();

    return res.status(SuccessStatusCode.SuccessNoContent).send();
  },
);
