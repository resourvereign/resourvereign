import { toStartCase } from '@slangy/client/string.js';
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { IntegrationUserPluginData, PluginType, UserPlugin } from '../../../../api/me/plugins';
import { PluginSchema } from '../../../../api/plugins';
import DraggableChooser from '../../../../components/DraggableChooser';
import useUserPlugins from '../../../../hooks/useUserPlugins';
import { iconForPluginType } from '../../icons';

import styles from './EditIntegrationPluginForm.module.css';

type EditIntegrationPluginFormProps = {
  data: [PluginSchema, IntegrationUserPluginData];
  onFinished?: () => void;
};

const EditIntegrationPluginForm = ({
  data: [schema, plugin],
  onFinished,
}: EditIntegrationPluginFormProps) => {
  const { create, update, byType } = useUserPlugins();
  const { register, handleSubmit, control } = useForm<IntegrationUserPluginData>({
    defaultValues: {
      ...plugin,
    },
  });

  const handleFormSubmit = useCallback(
    async (data: IntegrationUserPluginData) => {
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

  const extensionOptions = [...byType[PluginType.Scheduling], ...byType[PluginType.Notifications]];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="grid formgrid p-fluid flex">
      <div className="field col-12 text-900 font-medium text-xl text-center">{plugin.name}</div>
      <div className="field col-12 ">
        <label htmlFor="name">Label</label>
        <div className="p-inputgroup w-full">
          <div>
            <Controller
              name="color"
              control={control}
              rules={{ required: 'Color is required.' }}
              render={({ field }) => (
                <ColorPicker
                  name="color"
                  value={field.value}
                  className={classNames(styles.colorPicker)}
                  onChange={(e) => field.onChange(e.value)}
                />
              )}
            />
          </div>
          <InputText className="w-full" {...register('label')} />
        </div>
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

      <div className="field col-12 ">
        <label>Addons</label>
        <Controller
          name="addons"
          control={control}
          render={({ field }) => (
            <DraggableChooser
              options={extensionOptions}
              value={
                field.value
                  .map((id) => extensionOptions.find((option) => option.id === id))
                  .filter(Boolean) as UserPlugin[]
              }
              onChange={(value) => field.onChange(value.map((item) => item.id))}
              template={(item) => (
                <div className="p-3 border-round shadow-2 flex align-items-center">
                  <div>
                    <i className={classNames('pi pi-fw', iconForPluginType[item.type])} />
                  </div>
                  <div>
                    <span className="text-900 text-xl font-medium mb-2">{item.label}</span>
                    <p className="mt-1 mb-0 text-600 font-medium text-sm">{item.name}</p>
                  </div>
                </div>
              )}
            />
          )}
        />
      </div>
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

export default EditIntegrationPluginForm;
