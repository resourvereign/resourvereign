import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { MyIntent, MyIntentInput } from '../../../api/me/intents';
import useMyIntents from '../../../hooks/useMyIntents';
import useMyPlugins from '../../../hooks/useMyPlugins';

type EditIntentFormProps = {
  intent: MyIntentInput;
  onFinished?: () => void;
};

type EditIntentFormValues = {
  resource: string;
};

const EditIntentForm = ({ intent, onFinished }: EditIntentFormProps) => {
  const { resources } = useMyPlugins();
  const { add, update, remove } = useMyIntents();
  const { control, handleSubmit } = useForm<EditIntentFormValues>({
    defaultValues: { resource: intent.resource },
  });

  const onSubmit = useCallback(
    async (data: EditIntentFormValues) => {
      if ('id' in intent) {
        update({ ...intent, ...data });
      } else {
        add({ ...intent, ...data });
      }
      onFinished?.();
    },
    [add, intent, onFinished, update],
  );

  const handleDelete = useCallback(() => {
    if ('id' in intent) {
      // TODO: fix this
      remove(intent as unknown as MyIntent);
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
