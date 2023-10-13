import { format, startOfDay } from 'date-fns';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { MyIntentData } from '../../../api/me/intents';
import { PluginType } from '../../../api/plugins';
import useMyIntents from '../../../hooks/useMyIntents';
import useMyPlugins from '../../../hooks/useMyPlugins';

type EditIntentFormProps = {
  intent: MyIntentData;
  onFinished?: () => void;
};

type EditIntentFormValues = {
  resource: string;
};

const EditIntentForm = ({ intent, onFinished }: EditIntentFormProps) => {
  const resources = useMyPlugins().byType[PluginType.Resource];
  const { create, update, remove } = useMyIntents(startOfDay(intent.date));
  const { control, handleSubmit } = useForm<EditIntentFormValues>({
    defaultValues: { resource: intent.resource },
  });

  const onSubmit = useCallback(
    async (data: EditIntentFormValues) => {
      if ('id' in intent) {
        await update({ ...intent, ...data });
      } else {
        await create({ ...intent, ...data });
      }
      onFinished?.();
    },
    [create, intent, onFinished, update],
  );

  const handleDelete = useCallback(async () => {
    if ('id' in intent) {
      await remove(intent.id);
    }
    onFinished?.();
  }, [intent, onFinished, remove]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full grid formgrid p-fluid">
      <div className="field col-12 text-900 font-medium text-xl text-center">
        {format(intent.date, 'yyyy-MM-dd')}
      </div>
      <div className="field col-12 text-900 font-medium text-xl text-center">
        <Controller
          name="resource"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={resources}
              optionLabel="label"
              optionValue="id"
              placeholder="Select a resource"
              className="w-full"
              inputRef={field.ref}
              disabled={'id' in intent}
              {...field}
            />
          )}
        />
      </div>
      <div className="col-12">
        <Button className="w-auto mr-2">{'id' in intent ? 'Save' : 'Add'}</Button>
        <Button className="w-auto mr-2" severity="danger" onClick={onFinished}>
          Cancel
        </Button>
        {'id' in intent && (
          <Button className="w-auto" severity="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};

export default EditIntentForm;
