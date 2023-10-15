import { PluginType } from '../../../api/plugins';

import EditPluginDialog from './EditPluginDialog';
import PluginDropdown from './PluginDropdown';
import PluginList from './PluginList';
import usePluginActions from './usePluginActions';

type PluginTypeSectionProps = {
  pluginType: PluginType;
};
const PluginTypeSection = ({ pluginType }: PluginTypeSectionProps) => {
  const {
    plugins,
    editingMyPlugin,
    selectedPlugin,
    setSelectedPlugin,
    handleAddMyPlugin,
    handleEditMyPluginFinished,
    handleMyPluginEdit,
    handleMyPluginDelete,
  } = usePluginActions(pluginType);

  return (
    <div className="h-full w-full text-center flex flex-column align-items-center justify-content-between">
      <EditPluginDialog schemaAndPlugin={editingMyPlugin} onFinished={handleEditMyPluginFinished} />
      <PluginList
        type={pluginType}
        onPluginEdit={handleMyPluginEdit}
        onPluginDelete={handleMyPluginDelete}
      />
      <PluginDropdown
        items={plugins}
        selectedItem={selectedPlugin}
        onSelectionChange={setSelectedPlugin}
        onAdd={handleAddMyPlugin}
      />
    </div>
  );
};

export default PluginTypeSection;
