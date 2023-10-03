import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuthStore from '../hooks/useAuthStore';

interface NotSignedInGuardProps {
  redirectTo?: string;
}

const NotSignedInGuard = ({ redirectTo = '/' }: NotSignedInGuardProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const signedIn = !!user;

  useEffect(() => {
    if (signedIn) {
      navigate(redirectTo);
    }
  }, [signedIn, navigate, redirectTo]);

  return !signedIn ? <Outlet /> : null;
};

export default NotSignedInGuard;
