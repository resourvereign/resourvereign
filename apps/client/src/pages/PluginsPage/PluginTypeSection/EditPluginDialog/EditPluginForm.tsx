import { toStartCase } from '@slangy/client/string.js';
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { MyPluginData } from '../../../../api/me/plugins';
import { PluginSchema } from '../../../../api/plugins';
import useMyPlugins from '../../../../hooks/useMyPlugins';
import styles from '../../../SignInPage/index.module.css';

type EditPluginFormProps = {
  plugin: MyPluginData;
  schema: PluginSchema;
  onFinished?: () => void;
};

type EditionValues = {
  label: string;
  config: Record<string, string>;
};

const EditPluginForm = ({ plugin, schema, onFinished }: EditPluginFormProps) => {
  const { create, update } = useMyPlugins();
  const { register, handleSubmit, control } = useForm<EditionValues>({
    defaultValues: { label: plugin.label, config: plugin.config },
  });

  const onSubmit = useCallback(
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid formgrid p-fluid flex">
      <div className="field col-12 text-900 font-medium text-xl text-center">{plugin.name}</div>
      <div className="field col-12">
        <label htmlFor="name">Label</label>
        <InputText className="w-full mb-3" {...register('label')} />
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
                  className={classNames(styles.password, 'w-full mb-3')}
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
        <Button className="w-auto">{'id' in plugin ? 'Save' : 'Add'}</Button>
        <Button className="w-auto mr-2" severity="danger" onClick={onFinished}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditPluginForm;
