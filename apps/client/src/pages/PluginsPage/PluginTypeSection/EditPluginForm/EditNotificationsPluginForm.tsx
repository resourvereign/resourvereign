import { toStartCase } from '@slangy/client/string.js';
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { NotificationsUserPluginData } from '../../../../api/me/plugins';
import { PluginSchema } from '../../../../api/plugins';
import useUserPlugins from '../../../../hooks/useUserPlugins';

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

      {Object.entries(schema.properties).map(([name, definition]) => (
        <div key={name} className="field col-12">
          <label htmlFor={name}>{toStartCase(name)}</label>
          {definition.metadata?.secret ? (
            <Controller
              name={`config.${name}`}
              control={control}
              render={({ field }) => (
                <Password
                  className={classNames('w-full mb-3')}
                  inputClassName="w-full"
                  feedback={false}
                  toggleMask
                  inputRef={field.ref}
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
          ) : (
            <InputText className="w-full mb-3" {...register(`config.${name}`)} />
          )}
        </div>
      ))}
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
