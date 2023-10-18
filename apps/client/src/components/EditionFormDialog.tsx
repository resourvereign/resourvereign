import { Dialog } from 'primereact/dialog';
import { FC, useCallback, useEffect, useState } from 'react';

type EditionFormProps<T> = {
  data: T;
  onFinished: () => void;
};

type EditionFormDialogProps<T> = {
  data?: T;
  onEditionFinish: () => void;
  form: FC<EditionFormProps<T>>;
};

const EditionFormDialog = <T,>({ data, onEditionFinish, form }: EditionFormDialogProps<T>) => {
  const [visible, setVisible] = useState(!!data);
  const Form = form;

  const handleDialogHide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    setVisible(!!data);
  }, [data]);

  return (
    <Dialog visible={visible} closable={false} onHide={onEditionFinish} className="m-3">
      {data && <Form data={data} onFinished={handleDialogHide} />}
    </Dialog>
  );
};

export default EditionFormDialog;
