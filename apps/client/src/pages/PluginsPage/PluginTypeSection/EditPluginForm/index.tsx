import {
  IntegrationUserPluginData,
  NotificationsUserPluginData,
  PluginType,
  SchedulingUserPluginData,
  UserPluginData,
} from '../../../../api/me/plugins';
import { PluginSchema } from '../../../../api/plugins';

import EditIntegrationPluginForm from './EditIntegrationPluginForm';
import EditNotificationsPluginForm from './EditNotificationsPluginForm';
import EditSchedulingPluginForm from './EditSchedulingPluginForm';

type EditPluginFormProps<Type extends PluginType> = {
  type: Type;
  data: [
    PluginSchema,
    Type extends PluginType.Integration
      ? IntegrationUserPluginData
      : Type extends PluginType.Notifications
      ? NotificationsUserPluginData
      : Type extends PluginType.Scheduling
      ? SchedulingUserPluginData
      : UserPluginData,
  ];
  onFinished?: () => void;
};

const EditPluginForm = <Type extends PluginType>({
  type,
  data: [schema, plugin],
  onFinished,
}: EditPluginFormProps<Type>) => {
  switch (type) {
    case PluginType.Integration:
      return (
        <EditIntegrationPluginForm
          data={[schema, plugin as IntegrationUserPluginData]}
          onFinished={onFinished}
        />
      );
    case PluginType.Notifications:
      return (
        <EditNotificationsPluginForm
          data={[schema, plugin as NotificationsUserPluginData]}
          onFinished={onFinished}
        />
      );
    case PluginType.Scheduling:
      return (
        <EditSchedulingPluginForm
          data={[schema, plugin as SchedulingUserPluginData]}
          onFinished={onFinished}
        />
      );
  }
};

export default EditPluginForm;
