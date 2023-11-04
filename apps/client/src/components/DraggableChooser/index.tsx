import { ReactNode, useCallback } from 'react';

import Draggable from './Draggable';
import Droppable from './Droppable';

type DraggableChooserProps<Item, ItemId extends keyof Item> = {
  options?: Item[];
  value?: Item[];
  onChange?: (selected: Item[]) => void;
  template: (item: Item) => ReactNode;
  idKey?: ItemId;
};

enum DragTypes {
  Available = 'available',
  Selected = 'selected',
}

const DraggableChooser = <
  Item,
  ItemId extends keyof Item = 'id' extends keyof Item ? 'id' : never,
>({
  options = [],
  value = [],
  template,
  onChange,
  idKey = 'id' as ItemId,
}: DraggableChooserProps<Item, ItemId>) => {
  const handleDropOnAvailable = useCallback(
    (item: Item) => {
      const newSelected = value.filter((selectedItem) => selectedItem[idKey] !== item[idKey]);
      onChange?.(newSelected);
    },
    [idKey, onChange, value],
  );

  const handleDropOnSelected = useCallback(
    (item: Item) => {
      const newSelected = [...value, item];
      onChange?.(newSelected);
    },
    [onChange, value],
  );

  return (
    <div className="flex flex-row justify-content-center w-full">
      <div className="w-full mr-2 flex flex-column">
        <h4 className="text-center">Available</h4>
        <Droppable
          className="border-2 border-dashed surface-border border-round surface-card h-full"
          accept={DragTypes.Selected}
          onDrop={handleDropOnAvailable}
        >
          {options
            .filter((i) => !value.map((v) => v[idKey]).includes(i[idKey]))
            .map((item) => (
              <Draggable key={JSON.stringify(item[idKey])} item={item} type={DragTypes.Available}>
                {template(item)}
              </Draggable>
            ))}
        </Droppable>
      </div>
      <div className="w-full ml-2 flex flex-column">
        <h4 className="text-center">Selected</h4>
        <Droppable
          className="border-2 border-dashed surface-border border-round surface-card h-full"
          accept={DragTypes.Available}
          onDrop={handleDropOnSelected}
        >
          {value.map((item) => (
            <Draggable key={JSON.stringify(item[idKey])} item={item} type={DragTypes.Selected}>
              {template(item)}
            </Draggable>
          ))}
        </Droppable>
      </div>
    </div>
  );
};

export default DraggableChooser;
