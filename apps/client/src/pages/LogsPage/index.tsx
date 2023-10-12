import classNames from 'classnames';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Tag } from 'primereact/tag';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LogLevel, MyLog } from '../../api/me/logs';
import useMyLogs from '../../hooks/useMyLogs';

const logLevelToSeverityMap = {
  [LogLevel.DEBUG]: 'success' as 'success',
  [LogLevel.INFO]: 'info' as 'info',
  [LogLevel.WARN]: 'warning' as 'warning',
  [LogLevel.ERROR]: 'danger' as 'danger',
};

const logLevelToIconMap = {
  [LogLevel.DEBUG]: 'pi-code',
  [LogLevel.INFO]: 'pi-info-circle',
  [LogLevel.WARN]: 'pi-exclamation-triangle',
  [LogLevel.ERROR]: 'pi-ban',
};

const levelTemplate = (log: MyLog) => {
  return (
    <Tag severity={logLevelToSeverityMap[log.level]}>
      <i className={classNames('pi', logLevelToIconMap[log.level])} />
    </Tag>
  );
};

const LogsPage = () => {
  const [{ page, first }, setPagination] = useState({ page: 0, first: 0 });
  const { data: { data, pageSize, total } = {} } = useMyLogs(page);
  const { t } = useTranslation('pages', { keyPrefix: 'logs' });
  const handlePageChange = useCallback((e: PaginatorPageChangeEvent) => {
    setPagination({ page: e.page, first: e.first });
  }, []);

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
        <Column field="level" header={t('fields.level')} body={levelTemplate} />
        <Column field="created" header={t('fields.date')} />
        <Column field="message" header={t('fields.message')} />
      </DataTable>
      <Paginator
        first={first}
        rows={pageSize}
        totalRecords={total}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default LogsPage;
