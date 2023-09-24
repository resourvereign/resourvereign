import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

interface NotSignedInGuardProps {
  redirectTo?: string;
}

const NotSignedInGuard = ({ redirectTo = '/' }: NotSignedInGuardProps) => {
  const { user } = useAuth();
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
