import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { IntentData } from '../../api/me/intents';
import { PluginType } from '../../api/plugins';
import useIntents from '../../hooks/useIntents';
import useNotifications from '../../hooks/useNotifications';
import useUserPlugins from '../../hooks/useUserPlugins';

import { rangeFromMonth } from './utils';

type EditIntentFormProps = {
  data: IntentData;
  onFinished?: () => void;
};

type EditIntentFormValues = {
  integration: string;
};

const EditIntentForm = ({ data: intent, onFinished }: EditIntentFormProps) => {
  // TODO: probably a non-listing version of useIntents is needed to avoid unnecessary calls to listing intents.
  const [range, setRange] = useState(rangeFromMonth(intent.date));
  const integrations = useUserPlugins().byType[PluginType.Integration];

  const { success, warn } = useNotifications();

  const { create, update, remove } = useIntents(range.start, range.end);
  const { control, handleSubmit } = useForm<EditIntentFormValues>({
    defaultValues: { integration: intent.integration },
  });

  useEffect(() => {
    setRange(rangeFromMonth(intent.date));
  }, [intent.date]);

  const handleFormSubmit = useCallback(
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
      const result = await remove(intent.id);
      if (result && result.booking) {
        result.cancelled
          ? success(`Booking cancelled`, `${result.booking.description} was cacelled`)
          : warn(`Unable to cancel`, `${result.booking.description} could not be cancelled`);
      }
    }
    onFinished?.();
  }, [intent, onFinished, remove, success, warn]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full grid formgrid p-fluid">
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
