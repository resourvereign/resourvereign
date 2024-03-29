import { toStartCase } from '@slangy/client/string.js';
import classNames from 'classnames';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Tooltip } from 'primereact/tooltip';
import { createRef } from 'react';
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
    const descriptionTriggerRef = createRef<HTMLElement>();

    const renderControl = () => {
      switch (definition.type) {
        case 'string':
          return definition.metadata?.secret ? (
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
          );
        case 'int8':
        case 'int16':
        case 'int32':
        case 'uint8':
        case 'uint16':
        case 'uint32':
          return (
            <InputText
              className="w-full mb-3"
              {...register(controllerName, {
                setValueAs: (value) => parseInt(value, 10),
              })}
              type="number"
            />
          );
        case 'float32':
        case 'float64':
          return (
            <InputText
              className="w-full mb-3"
              {...register(controllerName, {
                setValueAs: (value) => parseFloat(value),
              })}
              type="number"
            />
          );
        case 'boolean':
          return (
            <Controller
              name={controllerName}
              control={control}
              render={({ field }) => (
                <InputSwitch
                  className="block mb-3"
                  checked={field.value}
                  inputRef={field.ref}
                  {...field}
                />
              )}
            />
          );
        default:
          return <div>Unsupported type: {definition.type}</div>;
      }
    };

    return (
      <div key={name} className="field col-12">
        {definition.metadata?.description && (
          <Tooltip target={descriptionTriggerRef} content={definition.metadata?.description} />
        )}
        <label htmlFor={name}>
          {definition.metadata?.name ?? toStartCase(name)}
          {definition.metadata?.description && (
            <i className="pi pi-question-circle ml-2" ref={descriptionTriggerRef} />
          )}
        </label>
        {renderControl()}
      </div>
    );
  });
};

export default PluginConfigForm;
