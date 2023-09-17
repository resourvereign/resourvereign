import classNames from 'classnames';
import { PropsWithChildren } from 'react';

type PageProps = PropsWithChildren<{
  title?: string;
  className?: string;
}>;

const Page = ({ children, title, className }: PageProps) => {
  return (
    <main className={classNames(className, 'grid')}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

export default Page;
