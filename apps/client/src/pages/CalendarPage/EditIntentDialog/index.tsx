import { Dialog } from 'primereact/dialog';

import { MyIntentData } from '../../../api/me/intents';

import EditIntentForm from './EditIntentForm';

type EditIntentDialogProps = {
  intent?: MyIntentData;
  onFinished?: () => void;
};
const EditIntentDialog = ({ intent, onFinished }: EditIntentDialogProps) => {
  return (
    <Dialog visible={!!intent} closable={false} onHide={() => {}}>
      {intent && <EditIntentForm intent={intent} onFinished={onFinished} />}
    </Dialog>
  );
};

export default EditIntentDialog;
