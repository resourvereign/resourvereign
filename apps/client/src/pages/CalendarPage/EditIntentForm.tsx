import { format, startOfMonth } from 'date-fns';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { MyIntentData } from '../../api/me/intents';
import { PluginType } from '../../api/plugins';
import useMyIntents from '../../hooks/useMyIntents';
import useMyPlugins from '../../hooks/useMyPlugins';

type EditIntentFormProps = {
  data: MyIntentData;
  onFinished?: () => void;
};

type EditIntentFormValues = {
  integration: string;
};

const EditIntentForm = ({ data: intent, onFinished }: EditIntentFormProps) => {
  // TODO: probably a non-listing version of useMyIntents is needed to avoid unnecessary calls to listing intents.
  const [month, setMonth] = useState(startOfMonth(intent.date));
  const integrations = useMyPlugins().byType[PluginType.Integration];
  const { create, update, remove } = useMyIntents(month);
  const { control, handleSubmit } = useForm<EditIntentFormValues>({
    defaultValues: { integration: intent.integration },
  });

  useEffect(() => {
    setMonth(startOfMonth(intent.date));
  }, [intent.date]);

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
          name="integration"
          control={control}
          render={({ field }) => (
            <Dropdown
              options={integrations}
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
        <Button type="submit" className="w-auto mr-2">
          {'id' in intent ? 'Save' : 'Add'}
        </Button>
        <Button type="button" className="w-auto mr-2" severity="danger" onClick={onFinished}>
          Cancel
        </Button>
        {'id' in intent && (
          <Button type="button" className="w-auto" severity="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};

export default EditIntentForm;
