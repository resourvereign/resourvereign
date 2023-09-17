import { Outlet } from 'react-router-dom';

const HeadlessLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default HeadlessLayout;
