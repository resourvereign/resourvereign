import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';

import useTasks from '../../hooks/useTasks';

const TasksPage = () => {
  const { data } = useTasks();
  const { t } = useTranslation('pages', { keyPrefix: 'tasks' });

  return (
    <div className="h-full flex flex-column">
      <DataTable
        value={data}
        size="small"
        stripedRows
        scrollable
        scrollHeight="flex"
        className="h-full overflow-y-hidden"
      >
        <Column field="created" header={t('fields.date')} />
        <Column field="title" header={t('fields.title')} />
      </DataTable>
    </div>
  );
};

export default TasksPage;
