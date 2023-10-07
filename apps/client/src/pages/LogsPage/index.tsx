import classNames from 'classnames';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useTranslation } from 'react-i18next';

import { LogLevel, MyLogRes } from '../../api/me/logs';
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

const levelTemplate = (log: MyLogRes) => {
  return (
    <Tag severity={logLevelToSeverityMap[log.level]}>
      <i className={classNames('pi', logLevelToIconMap[log.level])} />
    </Tag>
  );
};

const LogsPage = () => {
  const { myLogs } = useMyLogs();
  const { t } = useTranslation('pages', { keyPrefix: 'logs' });

  return (
    <DataTable value={myLogs} size="small" stripedRows>
      <Column field="level" header={t('fields.level')} body={levelTemplate} />
      <Column field="created" header={t('fields.date')} />
      <Column field="message" header={t('fields.message')} />
    </DataTable>
  );
};

export default LogsPage;
