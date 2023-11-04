import { PropsWithChildren } from 'react';
import { useDrag } from 'react-dnd';

type DraggableProps<T> = PropsWithChildren<{
  item: T;
  type: string;
}>;

const Draggable = <T,>({ children, item, type }: DraggableProps<T>) => {
  const [, drag] = useDrag<T>(
    () => ({
      type,
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [item, type],
  );

  return <div ref={drag}>{children}</div>;
};

export default Draggable;
