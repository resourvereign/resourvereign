import { format } from 'date-fns';
import { Button } from 'primereact/button';
import { useCallback } from 'react';

import { MyIntent, MyIntentInput } from '../../../api/me/intents';
import useMyIntents from '../../../hooks/useMyIntents';

type EditIntentFormProps = {
  intent: MyIntentInput;
  onFinished?: () => void;
};

const EditIntentForm = ({ intent, onFinished }: EditIntentFormProps) => {
  const { add, update, remove } = useMyIntents();

  const handleSave = useCallback(() => {
    if ('id' in intent) {
      update(intent);
    } else {
      add(intent);
    }
    onFinished?.();
  }, [add, intent, onFinished, update]);

  const handleDelete = useCallback(() => {
    if ('id' in intent) {
      remove(intent as MyIntent);
    }
    onFinished?.();
  }, [intent, onFinished, remove]);

  return (
    <div className="w-full grid formgrid p-fluid">
      <div className="field col-12 text-900 font-medium text-xl text-center">
        {format(intent.date, 'yyyy-MM-dd')}
      </div>
      <div className="col-12">
        <Button className="w-auto mr-2" onClick={handleSave}>
          {'id' in intent ? 'Save' : 'Add'}
        </Button>
        <Button className="w-auto mr-2" severity="danger" onClick={onFinished}>
          Cancel
        </Button>
        {'id' in intent && (
          <Button className="w-auto" severity="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditIntentForm;
