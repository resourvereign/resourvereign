import { toStartCase } from '@slangy/client/string.js';
import classNames from 'classnames';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Control, Controller, FieldValues, UseFormRegister } from 'react-hook-form';

import { PluginSchema } from '../../../../api/plugins';

type PluginConfigFormProps<T extends FieldValues> = {
  schema: PluginSchema;
  register: UseFormRegister<T>;
  control: Control<T>;
};

const PluginConfigForm = <T extends FieldValues>({
  schema,
  register,
  control,
}: PluginConfigFormProps<T>) => {
  return Object.entries(schema.properties).map(([name, definition]) => {
    // TODO: try to find an alternative
    const controllerName = `config.${name}` as any;

    return (
      <div key={name} className="field col-12">
        <label htmlFor={name}>{toStartCase(name)}</label>
        {definition.metadata?.secret ? (
          <Controller
            name={controllerName}
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
          <InputText className="w-full mb-3" {...register(controllerName)} />
        )}
      </div>
    );
  });
};

export default PluginConfigForm;
