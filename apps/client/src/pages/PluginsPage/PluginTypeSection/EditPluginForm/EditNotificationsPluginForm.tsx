import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { NotificationsUserPluginData } from '../../../../api/me/plugins';
import { PluginSchema } from '../../../../api/plugins';
import useUserPlugins from '../../../../hooks/useUserPlugins';

import PluginConfigForm from './PluginConfigForm';

type EditNotificationsPluginFormProps = {
  data: [PluginSchema, NotificationsUserPluginData];
  onFinished?: () => void;
};

const EditNotificationsPluginForm = ({
  data: [schema, plugin],
  onFinished,
}: EditNotificationsPluginFormProps) => {
  const { create, update } = useUserPlugins();
  const { register, handleSubmit, control } = useForm<NotificationsUserPluginData>({
    defaultValues: {
      ...plugin,
    },
  });

  const handleFormSubmit = useCallback(
    async (data: NotificationsUserPluginData) => {
      try {
        const newValues = {
          ...plugin,
          ...data,
        };

        if ('id' in newValues) {
          await update(newValues);
        } else {
          await create(newValues);
        }
        if (onFinished) {
          onFinished();
        }
      } catch (err) {
        console.log(err);
      }
    },
    [create, onFinished, plugin, update],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid formgrid p-fluid flex">
      <div className="field col-12 text-900 font-medium text-xl text-center">{plugin.name}</div>
      <div className="field col-12 ">
        <label htmlFor="name">Label</label>
        <InputText className="w-full" {...register('label')} />
      </div>

      <PluginConfigForm schema={schema} register={register} control={control} />

      <div className="col-12">
        <Button type="submit" className="w-auto mr-2">
          {'id' in plugin ? 'Save' : 'Add'}
        </Button>
        <Button type="button" className="w-auto" severity="danger" onClick={onFinished}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditNotificationsPluginForm;
