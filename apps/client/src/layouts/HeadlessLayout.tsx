import { Outlet } from 'react-router-dom';

const HeadlessLayout = () => {
  return (
    <div className="w-screen h-screen flex align-items-center justify-content-center">
      <Outlet />
    </div>
  );
};

export default HeadlessLayout;
