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
    editingUserPlugin,
    selectedPlugin,
    setSelectedPlugin,
    onUserPluginCreate,
    onUserPluginEditFinish,
    onUserPluginEdit,
    onUserPluginDelete,
  } = usePluginActions(pluginType);

  return (
    <div className="h-full w-full text-center flex flex-column align-items-center justify-content-between">
      <EditionFormDialog
        data={editingUserPlugin}
        onEditionFinish={onUserPluginEditFinish}
        form={EditPluginForm}
      />
      <PluginList
        type={pluginType}
        onPluginEdit={onUserPluginEdit}
        onPluginDelete={onUserPluginDelete}
      />
      <PluginDropdown
        items={plugins}
        selectedItem={selectedPlugin}
        onSelectionChange={setSelectedPlugin}
        onAdd={onUserPluginCreate}
      />
    </div>
  );
};

export default PluginTypeSection;
