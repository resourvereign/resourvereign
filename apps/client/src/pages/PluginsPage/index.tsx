import { TabPanel, TabView } from 'primereact/tabview';
import { useTranslation } from 'react-i18next';

import { PluginType } from '../../api/plugins';

import PluginTypeSection from './PluginTypeSection';

const tabIcons = {
  [PluginType.Integration]: 'pi pi-box',
  [PluginType.Notifications]: 'pi pi-send',
  [PluginType.Scheduling]: 'pi pi-clock',
};

const PluginsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings' });

  return (
    <div className="flex h-full test">
      <TabView
        className="w-full h-full flex flex-column"
        panelContainerClassName="flex-1 overflow-auto"
      >
        {Object.values(PluginType).map((type) => (
          <TabPanel
            key={type}
            header={t(`tabs.${type}`)}
            leftIcon={tabIcons[type]}
            className="h-full"
          >
            <PluginTypeSection pluginType={type} />
          </TabPanel>
        ))}
      </TabView>
    </div>
  );
};

export default PluginsPage;
