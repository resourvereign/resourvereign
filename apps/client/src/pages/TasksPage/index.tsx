import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useTranslation } from 'react-i18next';

import useTasks from '../../hooks/useTasks';
import { formatDate } from '../../shared/dates';

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
        <Column header={t('fields.execution')} body={(data) => formatDate(data.date)} />
        <Column
          header={t('fields.intent')}
          body={(data) => `${formatDate(data.intent.date)} - ${data.integration.label}`}
        />
      </DataTable>
    </div>
  );
};

export default TasksPage;
