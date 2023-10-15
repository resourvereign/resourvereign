import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useCallback } from 'react';

type PluginDropdownProps<T> = {
  items: T[] | undefined;
  selectedItem: T | undefined;
  onSelectionChange: (e: T) => void;
  onAdd: () => void;
};

const PluginDropdown = <T,>({
  items,
  selectedItem,
  onSelectionChange,
  onAdd,
}: PluginDropdownProps<T>) => {
  const handleOnChange = useCallback(
    (e: DropdownChangeEvent) => {
      onSelectionChange(e.value);
    },
    [onSelectionChange],
  );

  return (
    <div className="mt-3">
      <Dropdown
        options={items}
        value={selectedItem}
        optionLabel="name"
        onChange={handleOnChange}
        className="mr-2"
        placeholder="Select a plugin"
      />
      <Button icon="pi pi-plus" disabled={selectedItem === undefined} onClick={onAdd} />
    </div>
  );
};

export default PluginDropdown;
