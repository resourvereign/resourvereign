import { PluginType } from '../../../api/plugins';
import EditionFormDialog from '../../../components/EditionFormDialog';

import EditPluginForm from './EditPluginForm';
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
      <EditionFormDialog
        data={editingMyPlugin}
        onEditionFinished={handleEditMyPluginFinished}
        form={EditPluginForm}
      />
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
