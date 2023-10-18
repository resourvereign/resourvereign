import { toStartCase } from '@slangy/client/string.js';
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { UserPluginData } from '../../../api/me/plugins';
import { PluginSchema } from '../../../api/plugins';
import useUserPlugins from '../../../hooks/useUserPlugins';

import styles from './EditPluginForm.module.css';

type EditPluginFormProps = {
  data: [PluginSchema, UserPluginData];
  onFinished?: () => void;
};

type EditionValues = {
  label: string;
  color: string;
  config: Record<string, string>;
};

const EditPluginForm = ({ data: [schema, plugin], onFinished }: EditPluginFormProps) => {
  const { create, update } = useUserPlugins();
  const { register, handleSubmit, control } = useForm<EditionValues>({
    defaultValues: {
      label: plugin.label,
      color: plugin.color,
      config: plugin.config,
    },
  });

  const handleFormSubmit = useCallback(
    async (data: EditionValues) => {
      try {
        if ('id' in plugin) {
          await update({
            ...plugin,
            ...data,
          });
        } else {
          await create({
            ...plugin,
            ...data,
          });
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

export default EditPluginForm;
