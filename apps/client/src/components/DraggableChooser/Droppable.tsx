import { PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';

type DroppableProps = PropsWithChildren<{
  className?: string;
  accept: string;
  onDrop?: (item: any) => void;
}>;

const Droppable = <T,>({ children, className, accept, onDrop }: DroppableProps) => {
  const [, drop] = useDrop<T>(
    () => ({
      accept,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (item) => {
        onDrop?.(item);
      },
    }),
    [onDrop, accept],
  );

  return (
    <div ref={drop} className={className}>
      {children}
    </div>
  );
};

export default Droppable;
