import { Dialog } from 'primereact/dialog';

import { MyPluginData } from '../../../../api/me/plugins';
import { PluginSchema } from '../../../../api/plugins';

import EditPluginForm from './EditPluginForm';

type EditPluginDialogProps = {
  schemaAndPlugin?: [PluginSchema, MyPluginData];
  onFinished?: () => void;
};
const EditPluginDialog = ({ schemaAndPlugin, onFinished }: EditPluginDialogProps) => {
  return (
    <Dialog visible={!!schemaAndPlugin} closable={false} onHide={() => {}}>
      {schemaAndPlugin && (
        <EditPluginForm
          schema={schemaAndPlugin[0]}
          plugin={schemaAndPlugin[1]}
          onFinished={onFinished}
        />
      )}
    </Dialog>
  );
};

export default EditPluginDialog;
