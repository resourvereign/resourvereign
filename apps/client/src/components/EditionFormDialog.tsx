import { Dialog } from 'primereact/dialog';
import { useCallback, useEffect, useState } from 'react';

type EditionFormProps<T> = {
  data: T;
  onFinished: () => void;
};

type EditionFormDialogProps<T> = {
  data?: T;
  onEditionFinish: () => void;
  renderForm: (props: EditionFormProps<T>) => JSX.Element;
};

const EditionFormDialog = <T,>({
  data,
  onEditionFinish,
  renderForm,
}: EditionFormDialogProps<T>) => {
  const [visible, setVisible] = useState(!!data);

  const handleDialogHide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    setVisible(!!data);
  }, [data]);

  return (
    <Dialog visible={visible} closable={false} onHide={onEditionFinish} className="m-3">
      {data && renderForm({ data, onFinished: handleDialogHide })}
    </Dialog>
  );
};

export default EditionFormDialog;
