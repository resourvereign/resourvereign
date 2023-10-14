import { TabPanel, TabView } from 'primereact/tabview';
import { useTranslation } from 'react-i18next';

import { PluginType } from '../../api/plugins';

import PluginTypeSection from './PluginTypeSection';

const tabIcons = {
  [PluginType.Integration]: 'pi pi-box',
  [PluginType.Notifications]: 'pi pi-send',
};

const SettingsPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings' });

  return (
    <div className="flex h-full">
      <TabView className="w-full h-full flex flex-column" panelContainerClassName="h-full">
        {Object.values(PluginType).map((type) => (
          <TabPanel
            key={type}
            header={t(`tabs.${type}`)}
            leftIcon={tabIcons[type]}
            contentClassName="h-full flex"
          >
            <PluginTypeSection pluginType={type} />
          </TabPanel>
        ))}
      </TabView>
    </div>
  );
};

export default SettingsPage;
