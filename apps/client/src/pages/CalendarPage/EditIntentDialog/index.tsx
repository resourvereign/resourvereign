import { Dialog } from 'primereact/dialog';

import { MyIntentData } from '../../../api/me/intents';

import EditIntentForm from './EditIntentForm';

type IntentDialogProps = {
  intent?: MyIntentData;
  onFinished?: () => void;
};
const EditIntentDialog = ({ intent, onFinished }: IntentDialogProps) => {
  return (
    <Dialog visible={!!intent} closable={false} onHide={() => {}}>
      {intent && <EditIntentForm intent={intent} onFinished={onFinished} />}
    </Dialog>
  );
};

export default EditIntentDialog;
